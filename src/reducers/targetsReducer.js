import { turf } from '../utils/index'
import testLocations from '../testLocations.json'
import * as dt from '../services/digiTransit'

const initialTargets = {
    initialTargetsFC: turf.asFeatureCollection([]),
    kmTargetsFC: turf.asFeatureCollection([]),
    minTargetsFC: turf.asFeatureCollection([]),
    minTargetLabelsFC: turf.asFeatureCollection([]),
}

const targetsReducer = (store = initialTargets, action) => {

    switch (action.type) {
        case 'INITIALIZE_TARGETS':
            return {
                ...store,
                initialTargetsFC: action.targetsFC,
                kmTargetsFC: action.targetsFC,
            }
        case 'UPDATE_KM_TARGETS':
            return {
                ...store,
                kmTargetsFC: action.targetsFC,
            }
        case 'UPDATE_MIN_TARGETS': {
            const minTargetsFC = turf.combineFCs(store.minTargetsFC, action.minTargetsFC)
            return {
                ...store,
                minTargetsFC,
                minTargetLabelsFC: createLabelPoints(minTargetsFC),
            }
        }
        case 'UPDATE_USER_LOCATION': {
            return {
                ...store,
                initialTargetsFC: updateDistancesToTargets(action.coords, store.initialTargetsFC),
            }
        }
        default:
            return store
    }
}

const updateDistancesToTargets = (userCoords, kmTargetsFC) => {
    const features = kmTargetsFC.features.map(feature => {
        const distance = turf.getDistance(userCoords, feature.geometry.coordinates)
        return { ...feature, properties: { ...feature.properties, distance } }
    })
    return turf.asFeatureCollection(features)
}

const createLabelPoints = (FC) => {
    const features = FC.features.map(feature => {
        const centreCoords = feature.properties.centreCoords
        const offsetCoords = turf.getDestination(centreCoords, feature.properties.radius, 90)
        return turf.asPoint(offsetCoords, feature.properties)
    })
    return turf.asFeatureCollection(features)
}

export const initializeTargets = () => {
    const features = testLocations.features.map(feat => ({
        ...feat,
        properties: { ...feat.properties, transMode: 'BIRD', name: feat.properties.name, realCoords: feat.geometry.coordinates }
    }))
    return { type: 'INITIALIZE_TARGETS', targetsFC: turf.asFeatureCollection(features) }
}

export const setTransMode = (userLocFC, initialTargetsFC, kmTargetsFC, minTargetsFC, transMode, mapMode) => {
    return async (dispatch) => {
        dispatch({ type: 'SET_TRANS_MODE', transMode })
        if (mapMode === 'distance') {
            dispatch(updateKmTargets(userLocFC, initialTargetsFC, kmTargetsFC, transMode))
        } else {
            dispatch(updateMinTargets(userLocFC, initialTargetsFC, minTargetsFC, transMode))
        }
    }
}

export const updateKmTargets = (userLocFC, initialTargetsFC, kmTargetsFC, transMode) => {
    return async (dispatch) => {
        const originCoords = userLocFC.features[0].geometry.coordinates
        if (transMode === 'BIRD') {
            const feats = kmTargetsFC.features.map((feature) => {
                const realCoords = feature.properties.realCoords
                return { ...feature, properties: { ...feature.properties, transMode }, geometry: { ...feature.geometry, coordinates: realCoords } }
            })
            dispatch({ type: 'UPDATE_KM_TARGETS', targetsFC: turf.asFeatureCollection(feats) })
        } else {
            const feats = await kmTargetsFC.features.map(async (feature) => {
                const targetCoords = feature.properties.realCoords
                const bearing = turf.getBearing(originCoords, targetCoords)
                const distance = await dt.getTravelDistance(originCoords, targetCoords, transMode)
                const destCoords = turf.getDestination(originCoords, distance, bearing)
                return { ...feature, properties: { ...feature.properties, transMode }, geometry: { ...feature.geometry, coordinates: destCoords } }
            })
            const featsResolved = await Promise.all(feats)
            dispatch({ type: 'UPDATE_KM_TARGETS', targetsFC: turf.asFeatureCollection(featsResolved) })
        }
    }
}

export const updateMinTargets = (userLocFC, initialTargetsFC, minTargetsFC, mode) => {
    return async (dispatch) => {
        if (userLocFC.features.length === 0) {
            dispatch({ type: 'NO_USER_LOCATION' })
            return
        }
        const transMode = mode === 'BIRD' ? 'WALK' : mode
        dispatch({ type: 'SET_TRANS_MODE', transMode })

        const alreadyGot = minTargetsFC.features.filter(feat => feat.properties.transMode === transMode)

        if (alreadyGot.length === 0) {
            const features = initialTargetsFC.features.sort((feat1, feat2) => feat1.properties.distance - feat2.properties.distance)
            const closeFeatures = features.slice(0, 9)
            const originCoords = userLocFC.features[0].geometry.coordinates
            const feats = closeFeatures.map(async (feature) => {
                const targetCoords = feature.properties.realCoords
                const tts = await dt.getTravelTimes(originCoords, targetCoords, transMode)
                const bearing = turf.getBearing(originCoords, targetCoords)
                const destCoords = turf.getDestination(originCoords, tts.median * 100, bearing)
                const radius = tts.range > 2 ? (tts.range * 100) / 2 : 130
                if (isNaN(destCoords[0])) return new Promise((resolve) => resolve(null))
                const feat = turf.getCircle(destCoords, { ...feature.properties, radius, transMode, centreCoords: destCoords })
                return new Promise((resolve) => resolve(feat))
            })
            const featsResolved = await Promise.all(feats)
            const featsNotNull = featsResolved.filter(feat => feat !== null)
            dispatch({ type: 'UPDATE_MIN_TARGETS', minTargetsFC: turf.asFeatureCollection(featsNotNull) })
        }
    }
}

export default targetsReducer
