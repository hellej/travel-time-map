import { turf } from '../utils/index'

const circleRadiuses = [1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000]
const initialTtZones = {
    zonesFC: turf.asFeatureCollection([]),
}

const zonesReducer = (store = initialTtZones, action) => {

    switch (action.type) {
        case 'UPDATE_USER_LOCATION': {
            return {
                ...store,
                zonesFC: createCicles(action.coords)
            }
        }
        default:
            return store
    }
}

const createCicles = (coords) => {
    const circles = circleRadiuses.reduce((acc, value) => {
        const label = String(value / 100).concat(' min')
        return acc.concat(turf.getCircle([coords[0], coords[1]], { radius: value, zoneLabel: label }))
    }, [])
    return turf.asFeatureCollection(circles)
}

export default zonesReducer
