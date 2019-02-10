import { turf } from '../utils/index'
import testLocations from '../testLocations.json'
import * as dt from '../services/digiTransit'

const initialTargets = {
    targetsFC: turf.asFeatureCollection([]),
    targetLabelsFC: turf.asFeatureCollection([]),
}

const targetsReducer = (store = initialTargets, action) => {

    switch (action.type) {
        case 'INITIALIZE_TARGETS':
            return {
                ...store,
                targetsFC: action.targetsFC,
            }
        case 'UPDATE_TARGETS':
            return {
                ...store,
                targetsFC: action.targetsFC,
                targetLabelsFC: createLabelPoints(action.targetsFC),
            }
        default:
            return store
    }
}

const createLabelPoints = (FC) => {
    const features = FC.features.map(feature => {
        return turf.asPoint(feature.properties.centreCoords, feature.properties)
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

export const updateTtTargets = (userLocFC, targetsFC) => {
    return async (dispatch) => {
        if (userLocFC.features.length === 0) {
            dispatch({ type: 'NO_USER_LOCATION' })
            return
        }
        const originCoords = userLocFC.features[0].geometry.coordinates
        targetsFC.features.reduce(async (previousPromise, feature) => {
            const acc = await previousPromise
            const targetCoords = feature.geometry.coordinates
            const tts = await dt.getTravelTimes(originCoords, targetCoords)
            const bearing = turf.getBearing(originCoords, targetCoords)
            const destCoords = turf.getDestination(originCoords, tts.mean * 100, bearing)
            const radius = tts.range > 1 ? (tts.range * 100) / 2 : 40
            console.log('tts', tts)
            console.log('bearing', bearing)
            console.log('destCoords', destCoords)
            console.log('radius', radius)
            const feat = turf.getCircle(destCoords, { radius, centreCoords: destCoords, ...feature.properties })
            acc.push(feat)
            const FC = turf.asFeatureCollection(acc)
            console.log('fc', FC)
            dispatch({ type: 'UPDATE_TARGETS', targetsFC: FC, targetLabelsFC: testLocations })
            return acc
        }, Promise.resolve([]))
    }
}

export default targetsReducer
