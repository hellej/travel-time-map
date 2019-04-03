import { turf } from '../utils/index'
import { updateKmTargets } from './targetsReducer'
import { updateMinTargets } from './targetsReducer'

const circleRadiuses = [1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000, 11000, 12000, 13000, 14000, 15000]
const initialTtZones = {
    mapMode: 'distance',
    transMode: 'BIRD',
    zonesFC: turf.asFeatureCollection([]),
}

const zonesReducer = (store = initialTtZones, action) => {

    switch (action.type) {
        case 'UPDATE_USER_LOCATION': {
            return {
                ...store,
                zonesFC: createCirclesFC(action.coords, store.mapMode),
            }
        }
        case 'SET_TRANS_MODE': {
            return {
                ...store,
                transMode: action.transMode,
            }
        }
        case 'SET_MAP_MODE': {
            return {
                ...store,
                mapMode: action.mapMode,
                zonesFC: createCirclesFC(action.coords, action.mapMode),
            }
        }
        default:
            return store
    }
}

const createDurationLabel = (value) => String(value / 100).concat(' min')

const createDistanceLabel = (value) => String(value / 1000).concat(' km')

const createCirclesFC = (coords, mapMode) => {
    const circles = circleRadiuses.reduce((acc, value) => {
        const label = mapMode === 'duration' ? createDurationLabel(value) : createDistanceLabel(value)
        return acc.concat(turf.getCircle([coords[0], coords[1]], { radius: value, zoneLabel: label }))
    }, [])
    return turf.asFeatureCollection(circles)
}

export const setMapMode = (userLocFC, initialTargetsFC, kmTargetsFC, minTargetsFC, transMode, mapMode) => {
    return async (dispatch) => {
        const originCoords = userLocFC.features[0].geometry.coordinates
        dispatch({ type: 'SET_MAP_MODE', mapMode, coords: originCoords })
        if (mapMode === 'distance') {
            dispatch(updateKmTargets(userLocFC, initialTargetsFC, kmTargetsFC, transMode))
        } else {
            dispatch(updateMinTargets(userLocFC, initialTargetsFC, minTargetsFC, transMode))
        }
    }
}

export default zonesReducer
