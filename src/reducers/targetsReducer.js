import { turf } from '../utils/index'
import testLocations from '../testLocations.json'

const initialTargets = {
    targetsFC: turf.asFeatureCollection([]),
    targetLabelsFC: turf.asFeatureCollection([]),
}

const targetsReducer = (store = initialTargets, action) => {

    switch (action.type) {
        case 'UPDATE_TARGETS':
            return {
                ...store,
                targetsFC: action.targets,
                targetLabelsFC: action.targetLabels,
            }
        default:
            return store
    }
}

export const updateTargets = () => {

    const targets = {
        ...testLocations,
        features: testLocations.features.map(feat => {
            return turf.getCircle(feat.geometry.coordinates, { radius: 300, name: feat.properties.name })
        })
    }
    return (dispatch) => {
        dispatch({ type: 'UPDATE_TARGETS', targets, targetLabels: testLocations })
    }
}


export default targetsReducer
