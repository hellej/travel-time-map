import { turf } from '../utils/index'
import testLocations from '../testLocations.json'
import * as dt from '../services/digiTransit'

const initialTargets = {
    realTargetsFC: turf.asFeatureCollection([]),
    ttTargetsFC: turf.asFeatureCollection([]),
    ttTargetLabelsFC: turf.asFeatureCollection([]),
}

const targetsReducer = (store = initialTargets, action) => {

    switch (action.type) {
        case 'INITIALIZE_TARGETS':
            return {
                ...store,
                realTargetsFC: action.targetsFC,
                ttTargetsFC: action.targetsFC,
            }
        case 'UPDATE_TT_TARGETS':
            return {
                ...store,
                ttTargetsFC: action.ttTargetsFC,
                ttTargetLabelsFC: createLabelPoints(action.ttTargetsFC),
            }
        case 'UPDATE_USER_LOCATION': {
            return {
                ...store,
                realTargetsFC: updateDistancesToTargets(action.coords, store.realTargetsFC),
            }
        }
        default:
            return store
    }
}

const updateDistancesToTargets = (userCoords, realTargetsFC) => {
    const features = realTargetsFC.features.map(feature => {
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

export const updateTtTargets = (userLocFC, realTargetsFC) => {
    return async (dispatch) => {
        if (userLocFC.features.length === 0) {
            dispatch({ type: 'NO_USER_LOCATION' })
            return
        }
        const originCoords = userLocFC.features[0].geometry.coordinates
        dispatch({ type: 'SET_ZONE_MODE_TO_TT', coords: originCoords })

        const features = realTargetsFC.features.sort((feat1, feat2) => feat1.properties.distance - feat2.properties.distance)
        console.log('features', features.slice(0, 8))

        features.slice(0, 8).reduce(async (previousPromise, feature) => {
            const features = await previousPromise
            const targetCoords = feature.geometry.coordinates
            const tts = await dt.getTravelTimes(originCoords, targetCoords)
            const bearing = turf.getBearing(originCoords, targetCoords)
            const destCoords = turf.getDestination(originCoords, tts.mean * 100, bearing)
            const radius = tts.range > 2 ? (tts.range * 100) / 2 : 130
            console.log('tts', tts)
            const feat = turf.getCircle(destCoords, { radius, centreCoords: destCoords, ...feature.properties })
            features.push(feat)
            const FC = turf.asFeatureCollection(features)
            dispatch({ type: 'UPDATE_TT_TARGETS', ttTargetsFC: FC, ttTargetLabelsFC: testLocations })
            return features
        }, Promise.resolve([]))
    }
}

export default targetsReducer
