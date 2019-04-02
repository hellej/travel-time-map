import { turf } from '../utils/index'

const circleRadiuses = [1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000, 11000, 12000, 13000, 14000, 15000]
const initialTtZones = {
    mode: 'distance',
    transMode: 'BIRD',
    zonesFC: turf.asFeatureCollection([]),
}

const zonesReducer = (store = initialTtZones, action) => {

    switch (action.type) {
        case 'UPDATE_USER_LOCATION': {
            return {
                ...store,
                zonesFC: createCirclesFC(action.coords, store.mode),
            }
        }
        case 'SET_TRANS_MODE': {
            return {
                ...store,
                transMode: action.mode,
            }
        }
        case 'SET_ZONE_MODE_TO_MIN': {
            return {
                ...store,
                mode: 'duration',
                zonesFC: createCirclesFC(action.coords, 'duration'),
            }
        }
        case 'TOGGLE_DISTANCE_ZONES': {
            return {
                ...store,
                mode: 'distance',
                zonesFC: createCirclesFC(action.coords, 'distance'),
            }
        }
        default:
            return store
    }
}

const createDurationLabel = (value) => String(value / 100).concat(' min')

const createDistanceLabel = (value) => String(value / 1000).concat(' km')

const createCirclesFC = (coords, mode) => {
    const circles = circleRadiuses.reduce((acc, value) => {
        const label = mode === 'duration' ? createDurationLabel(value) : createDistanceLabel(value)
        return acc.concat(turf.getCircle([coords[0], coords[1]], { radius: value, zoneLabel: label }))
    }, [])
    return turf.asFeatureCollection(circles)
}

export default zonesReducer
