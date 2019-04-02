import { turf } from '../utils/index'
import testLocations from '../testLocations.json'
import * as dt from '../services/digiTransit'

const initialTargets = {
    kmTargetsFC: turf.asFeatureCollection([]),
    minTargetsFC: turf.asFeatureCollection([]),
    minTargetLabelsFC: turf.asFeatureCollection([]),
}

const targetsReducer = (store = initialTargets, action) => {

    switch (action.type) {
        case 'INITIALIZE_TARGETS':
            return {
                ...store,
                kmTargetsFC: action.targetsFC,
                minTargetsFC: action.targetsFC,
            }
        case 'UPDATE_KM_TARGETS':
            return {
                ...store,
                kmTargetsFC: action.targetsFC,
            }
        case 'UPDATE_MIN_TARGETS':
            return {
                ...store,
                minTargetsFC: action.minTargetsFC,
                minTargetLabelsFC: createLabelPoints(action.minTargetsFC),
            }
        case 'UPDATE_USER_LOCATION': {
            return {
                ...store,
                kmTargetsFC: updateDistancesToTargets(action.coords, store.kmTargetsFC),
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

export const setTransMode = (userLocFC, kmTargetsFC, minTargetsFC, transMode, mapMode) => {
    return async (dispatch) => {
        dispatch({ type: 'SET_TRANS_MODE', transMode })
    }
}

export const updateKmTargets = (userLocFC, kmTargetsFC, transMode) => {
    return async (dispatch) => {
        const originCoords = userLocFC.features[0].geometry.coordinates
        if (transMode !== 'BIRD') {
            const feats = kmTargetsFC.features.map((feature) => {
                const realCoords = feature.properties.realCoords
                return { ...feature, geometry: { ...feature.geometry, coordinates: realCoords } }
            })
            dispatch({ type: 'UPDATE_KM_TARGETS', targetsFC: turf.asFeatureCollection(feats) })
        } else {
            const feats = kmTargetsFC.features.map(async (feature) => {
                const targetCoords = feature.properties.realCoords
                const bearing = turf.getBearing(originCoords, targetCoords)
                const distance = await dt.getTravelTimes(originCoords, targetCoords, transMode)
                const destCoords = turf.getDestination(originCoords, distance, bearing)
                return { ...feature, geometry: { ...feature.geometry, coordinates: destCoords } }
            })
            dispatch({ type: 'UPDATE_KM_TARGETS', targetsFC: turf.asFeatureCollection(feats) })
        }
        dispatch({ type: 'TOGGLE_DISTANCE_ZONES', coords: originCoords })
    }
}

export const updateMinTargets = (userLocFC, kmTargetsFC, mode) => {
    return async (dispatch) => {
        if (userLocFC.features.length === 0) {
            dispatch({ type: 'NO_USER_LOCATION' })
            return
        }
        const transMode = mode === 'BIRD' ? 'BICYCLE' : mode

        const originCoords = userLocFC.features[0].geometry.coordinates
        dispatch({ type: 'SET_ZONE_MODE_TO_MIN', coords: originCoords })
        dispatch({ type: 'SET_TRANS_MODE', transMode })

        const features = kmTargetsFC.features.sort((feat1, feat2) => feat1.properties.distance - feat2.properties.distance)
        const closeFeatures = features.slice(0, 8)

        const feats = closeFeatures.map(async (feature) => {
            const targetCoords = feature.properties.realCoords
            const tts = await dt.getTravelTimes(originCoords, targetCoords, transMode)
            const bearing = turf.getBearing(originCoords, targetCoords)
            const destCoords = turf.getDestination(originCoords, tts.median * 100, bearing)
            const radius = tts.range > 2 ? (tts.range * 100) / 2 : 130
            const feat = turf.getCircle(destCoords, { ...feature.properties, radius, transMode, centreCoords: destCoords })
            return new Promise((resolve) => resolve(feat))
        })
        const featsResolved = await Promise.all(feats)
        dispatch({ type: 'UPDATE_MIN_TARGETS', minTargetsFC: turf.asFeatureCollection(featsResolved) })
    }
}

export default targetsReducer
