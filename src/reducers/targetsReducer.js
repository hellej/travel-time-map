import { turf } from '../utils/index'
import poolLocations from '../poolLocations.json'
import { showNotification } from './notificationReducer'
import * as dt from '../services/digiTransit'
import { utils } from './../utils/index'

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
                minTargetLabelsFC: utils.createLabelPoints(minTargetsFC),
            }
        }
        case 'UPDATE_USER_LOCATION':
            return {
                ...store,
                initialTargetsFC: utils.updateDistancesToTargets(action.coords, store.initialTargetsFC),
                kmTargetsFC: utils.updateRoutePlannerLinksToTargets(action.coords, store.kmTargetsFC),
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

export const resetTargets = (userLocFC, initialTargetsFC, transMode, mapMode) => {
    return async (dispatch) => {
        const userCoords = turf.getFirstPointCoords(userLocFC)
        const targetsFC = utils.updateDistancesToTargets(userCoords, initialTargetsFC)
        const targetsLinksFC = utils.updateRoutePlannerLinksToTargets(userCoords, targetsFC)
        dispatch({ type: 'INITIALIZE_TARGETS', targetsFC: targetsLinksFC })
        dispatch(setTransMode(userLocFC, targetsFC, targetsFC, emptyFC, transMode, mapMode))
    }
}

export const setTransMode = (userLocFC, initialTargetsFC, kmTargetsFC, minTargetsFC, transMode, mapMode) => {
    return async (dispatch) => {
        dispatch({ type: 'SET_TRANS_MODE', transMode })
        mapMode === 'distance'
            ? dispatch(updateKmTargets(userLocFC, initialTargetsFC, kmTargetsFC, transMode))
            : dispatch(updateMinTargets(userLocFC, initialTargetsFC, minTargetsFC, transMode))
    }
}

export const updateKmTargets = (userLocFC, initialTargetsFC, kmTargetsFC, transMode) => {
    return async (dispatch) => {
        if (userLocFC.features.length === 0) {
            dispatch({ type: 'NO_USER_LOCATION' })
            return
        }
        const userCoords = turf.getFirstPointCoords(userLocFC)
        // Check if km targets with the selected transport mode were already got
        const alreadyGot = kmTargetsFC.features.filter(feat => feat.properties.transMode === transMode)
        if (alreadyGot.length === 0) {
            if (transMode === 'BIRD') {
                const feats = initialTargetsFC.features.map((feature) => {
                    const distance = turf.getDistance(userCoords, feature.properties.realCoords)
                    return { ...feature, properties: { ...feature.properties, transMode, distance }, geometry: { ...feature.geometry, coordinates: feature.properties.realCoords } }
                })
                dispatch({ type: 'UPDATE_KM_TARGETS', kmTargetsFC: turf.asFeatureCollection(feats) })
            } else {
                dispatch({ type: 'KM_QUERY_STARTED' })
                const feats = await initialTargetsFC.features.map(async (feature) => {
                    const realCoords = feature.properties.realCoords
                    const bearing = turf.getBearing(userCoords, realCoords)
                    const distance = await dt.getTravelDistance(userCoords, realCoords, transMode)
                    const destCoords = turf.getDestination(userCoords, distance, bearing)
                    const rpLink = utils.getRoutePlannerLink(userCoords, feature, transMode)
                    return { ...feature, properties: { ...feature.properties, transMode, distance, rpLink }, geometry: { ...feature.geometry, coordinates: destCoords } }
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
        const userCoords = turf.getFirstPointCoords(userLocFC)
        const transMode = mode === 'BIRD' ? 'PT' : mode
        dispatch({ type: 'SET_TRANS_MODE', transMode })
        // Check if min targets with the selected transport mode were already got
        const alreadyGot = minTargetsFC.features.filter(feat => feat.properties.transMode === transMode)
        if (alreadyGot.length === 0) {
            dispatch({ type: 'MIN_QUERY_STARTED' })
            const closeFeatures = utils.getNClosestFeats(initialTargetsFC, 15)
            const feats = closeFeatures.map(async (feature) => {
                const realCoords = feature.properties.realCoords
                const tts = await dt.getTravelTimes(userCoords, realCoords, transMode)
                if (isNaN(tts.mean)) return new Promise((resolve) => resolve(null))
                const bearing = turf.getBearing(userCoords, realCoords)
                const destCoords = turf.getDestination(userCoords, tts.median * 100, bearing)
                const radius = tts.range > 2 ? (tts.range * 100) / 2 : 130
                const rpLink = utils.getRoutePlannerLink(userCoords, feature, transMode)
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
