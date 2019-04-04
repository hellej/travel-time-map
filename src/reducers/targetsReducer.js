import { turf } from '../utils/index'
import poolLocations from '../poolLocations.json'
import { showNotification } from './notificationReducer'
import * as dt from '../services/digiTransit'

const emptyFC = turf.asFeatureCollection([])

const initialTargets = {
    initialTargetsFC: emptyFC,
    kmTargetsFC: emptyFC,
    minTargetsFC: emptyFC,
    minTargetLabelsFC: emptyFC,
}

const targetsReducer = (store = initialTargets, action) => {

    switch (action.type) {
        case 'INITIALIZE_TARGETS':
            return {
                ...store,
                initialTargetsFC: action.targetsFC,
                kmTargetsFC: action.targetsFC,
                minTargetsFC: emptyFC,
                minTargetLabelsFC: emptyFC,
            }
        case 'UPDATE_KM_TARGETS': {
            const kmTargetsFC = turf.combineFCs(store.kmTargetsFC, action.kmTargetsFC)
            return {
                ...store,
                kmTargetsFC,
            }
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
                kmTargetsFC: updateRPLinksToBirdKmTargets(action.coords, store.kmTargetsFC),
            }
        }
        default:
            return store
    }
}

export const initializeTargets = () => {
    const features = poolLocations.features.map(feat => ({
        ...feat,
        properties: { ...feat.properties, transMode: 'BIRD', name: feat.properties.name, realCoords: feat.geometry.coordinates }
    }))
    return { type: 'INITIALIZE_TARGETS', targetsFC: turf.asFeatureCollection(features) }
}

const getRoutePlannerLink = (userCoords, feat, transMode) => {
    const baseUrl = 'https://reittiopas.hsl.fi/reitti/'
    const toCoords = feat.properties.realCoords
    const fromString = 'Current location ::' + userCoords[1] + ',' + userCoords[0]
    const toString = feat.properties.name + '::' + toCoords[1] + ',' + toCoords[0]
    const modeString = transMode === 'CAR' ? 'CAR,CAR_PARK' : transMode
    const url = baseUrl + fromString + '/' + toString + '?modes=' + modeString
    return encodeURI(url)
}

const updateDistancesToTargets = (userCoords, kmTargetsFC) => {
    const features = kmTargetsFC.features.map(feature => {
        const distance = turf.getDistance(userCoords, feature.properties.realCoords)
        return { ...feature, properties: { ...feature.properties, distance } }
    })
    return turf.asFeatureCollection(features)
}

const updateRPLinksToBirdKmTargets = (userCoords, kmTargetsFC) => {
    const otherTargets = kmTargetsFC.features.filter(feat => feat.properties.transMode !== 'BIRD')
    const birdTargets = kmTargetsFC.features.filter(feat => feat.properties.transMode === 'BIRD')
    const birdTargetsWithRpLinks = birdTargets.map((feature) => {
        const rpLink = getRoutePlannerLink(userCoords, feature, 'WALK')
        return { ...feature, properties: { ...feature.properties, rpLink } }
    })
    return turf.asFeatureCollection(birdTargetsWithRpLinks.concat(otherTargets))
}

const createLabelPoints = (FC) => {
    const features = FC.features.map(feature => {
        const centreCoords = feature.properties.centreCoords
        const offsetCoords = turf.getDestination(centreCoords, feature.properties.radius, 90)
        return turf.asPoint(offsetCoords, feature.properties)
    })
    return turf.asFeatureCollection(features)
}

export const updateTargets = (userLocFC, initialTargetsFC, transMode, mapMode) => {
    return async (dispatch) => {
        const userCoords = userLocFC.features[0].geometry.coordinates
        const targetsFC = updateDistancesToTargets(userCoords, initialTargetsFC)
        dispatch({ type: 'INITIALIZE_TARGETS', targetsFC })
        dispatch(setTransMode(userLocFC, targetsFC, targetsFC, emptyFC, transMode, mapMode))
    }
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
        if (userLocFC.features.length === 0) {
            dispatch({ type: 'NO_USER_LOCATION' })
            return
        }
        const userCoords = userLocFC.features[0].geometry.coordinates
        const alreadyGot = kmTargetsFC.features.filter(feat => feat.properties.transMode === transMode)
        if (alreadyGot.length === 0) {
            if (transMode === 'BIRD') {
                const feats = initialTargetsFC.features.map((feature) => {
                    return { ...feature, properties: { ...feature.properties, transMode }, geometry: { ...feature.geometry, coordinates: feature.properties.realCoords } }
                })
                dispatch({ type: 'UPDATE_KM_TARGETS', kmTargetsFC: turf.asFeatureCollection(feats) })
            } else {
                dispatch({ type: 'KM_QUERY_STARTED' })
                const feats = await initialTargetsFC.features.map(async (feature) => {
                    const targetCoords = feature.properties.realCoords
                    const bearing = turf.getBearing(userCoords, targetCoords)
                    const distance = await dt.getTravelDistance(userCoords, targetCoords, transMode)
                    const destCoords = turf.getDestination(userCoords, distance, bearing)
                    const rpLink = getRoutePlannerLink(userCoords, feature, transMode)
                    return { ...feature, properties: { ...feature.properties, transMode, rpLink }, geometry: { ...feature.geometry, coordinates: destCoords } }
                })
                const featsResolved = await Promise.all(feats)
                if (featsResolved.length === 0) {
                    dispatch(showNotification("Couldn't get distances", 'error', 4))
                } else {
                    dispatch({ type: 'UPDATE_KM_TARGETS', kmTargetsFC: turf.asFeatureCollection(featsResolved) })
                }
            }
        }
    }
}

export const updateMinTargets = (userLocFC, initialTargetsFC, minTargetsFC, mode) => {
    return async (dispatch) => {
        if (userLocFC.features.length === 0) {
            dispatch({ type: 'NO_USER_LOCATION' })
            return
        }
        const transMode = mode === 'BIRD' ? 'PT' : mode
        dispatch({ type: 'SET_TRANS_MODE', transMode })

        const alreadyGot = minTargetsFC.features.filter(feat => feat.properties.transMode === transMode)
        if (alreadyGot.length === 0) {
            dispatch({ type: 'MIN_QUERY_STARTED' })
            const features = initialTargetsFC.features.sort((feat1, feat2) => feat1.properties.distance - feat2.properties.distance)
            const closeFeatures = features.slice(0, 9)
            const userCoords = userLocFC.features[0].geometry.coordinates
            const feats = closeFeatures.map(async (feature) => {
                const targetCoords = feature.properties.realCoords
                const tts = await dt.getTravelTimes(userCoords, targetCoords, transMode)
                const bearing = turf.getBearing(userCoords, targetCoords)
                const destCoords = turf.getDestination(userCoords, tts.median * 100, bearing)
                const radius = tts.range > 2 ? (tts.range * 100) / 2 : 130
                if (isNaN(destCoords[0])) return new Promise((resolve) => resolve(null))
                const rpLink = getRoutePlannerLink(userCoords, feature, transMode)
                const feat = turf.getCircle(destCoords, { ...feature.properties, radius, transMode, rpLink, centreCoords: destCoords })
                return new Promise((resolve) => resolve(feat))
            })
            const featsResolved = await Promise.all(feats)
            const featsNotNull = featsResolved.filter(feat => feat !== null)
            if (featsNotNull.length === 0) {
                dispatch(showNotification("Couldn't get travel times", 'error', 4))
            } else {
                dispatch({ type: 'UPDATE_MIN_TARGETS', minTargetsFC: turf.asFeatureCollection(featsNotNull) })
            }
        }
    }
}

export default targetsReducer
