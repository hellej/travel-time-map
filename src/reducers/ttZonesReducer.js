import { turf } from '../utils/index'

const circleRadiuses = [1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000]
const initialTtZones = {
    ttZonesFC: turf.asFeatureCollection([]),
}

const userLocationReducer = (store = initialTtZones, action) => {

    switch (action.type) {
        case 'UPDATE_USER_LOCATION': {
            return {
                ...store,
                ttZonesFC: createCicles(action.lngLat)
            }
        }
        default:
            return store
    }
}

const createCicles = (lngLat) => {
    const circles = circleRadiuses.reduce((acc, value) => {
        const label = String(value/100).concat(' min')
        return acc.concat(turf.getCircle([lngLat.lng, lngLat.lat], { radius: value, zoneLabel: label }))
    }, [])
    return turf.asFeatureCollection(circles)
}

export default userLocationReducer