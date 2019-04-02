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
        properties: { ...feat.properties, name: feat.properties.name, realCoords: feat.geometry.coordinates }
    }))
    return { type: 'INITIALIZE_TARGETS', targetsFC: turf.asFeatureCollection(features) }
}

export const updateKmTargets = (userLocFC) => {
    const originCoords = userLocFC.features[0].geometry.coordinates
    return { type: 'TOGGLE_DISTANCE_ZONES', coords: originCoords }
}

export const updateMinTargets = (userLocFC, kmTargetsFC, mode) => {
    return async (dispatch) => {
        if (userLocFC.features.length === 0) {
            dispatch({ type: 'NO_USER_LOCATION' })
            return
        }
        if (mode === 'BIRD') {
            mode = 'BICYCLE'
        }
        const originCoords = userLocFC.features[0].geometry.coordinates
        dispatch({ type: 'SET_ZONE_MODE_TO_MIN', coords: originCoords })
        dispatch({ type: 'SET_TRANS_MODE', mode: mode })

        const features = kmTargetsFC.features.sort((feat1, feat2) => feat1.properties.distance - feat2.properties.distance)
        console.log('features', features.slice(0, 8))

        features.slice(0, 10).reduce(async (previousPromise, feature) => {
            const features = await previousPromise
            const targetCoords = feature.geometry.coordinates
            const tts = await dt.getTravelTimes(originCoords, targetCoords, mode)
            console.log('tts', tts)
            const bearing = turf.getBearing(originCoords, targetCoords)
            const destCoords = turf.getDestination(originCoords, tts.median * 100, bearing)
            const radius = tts.range > 2 ? (tts.range * 100) / 2 : 130
            const feat = turf.getCircle(destCoords, { radius, transMode: mode, centreCoords: destCoords, ...feature.properties })
            features.push(feat)
            dispatch({ type: 'UPDATE_MIN_TARGETS', minTargetsFC: turf.asFeatureCollection(features) })
            return features
        }, Promise.resolve([]))
    }
}

export default targetsReducer
