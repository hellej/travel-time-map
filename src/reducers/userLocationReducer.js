import { turf } from '../utils/index'
import extent from '../extent.json'

const geoOptions = {
  enableHighAccuracy: true,
  maximumAge: 30000,
  timeout: 6000,
}
const initialUserLocation = {
  expireTime: '',
  error: null,
  userLocFC: turf.asFeatureCollection([]),
  userLocHistory: [],
}

const userLocationReducer = (store = initialUserLocation, action) => {

  switch (action.type) {
    case 'START_TRACKING_USER_LOCATION':
      return {
        ...store,
        error: 'Waiting for location...'
      }
    case 'ERROR_IN_POSITIONING':
      return {
        ...store,
        error: 'Have you enabled location services?'
      }
    case 'UPDATE_USER_LOCATION': {
      const within = withinSupportedArea(action.userLocFC)
      return {
        ...store,
        error: within ? null : 'You seem to be outside the supported area',
        userLocFC: action.userLocFC,
        userLocHistory: store.userLocHistory.concat([action.coords]),
      }
    }
    case 'RESET_USER_LOCATION':
      return initialUserLocation

    default:
      return store
  }
}

export const mockUserLocation = () => {
  return async (dispatch) => {
    await new Promise(resolve => setTimeout(resolve, 2000))
    const lng = 24.93312835
    const lat = 60.16910312
    const userLocFC = turf.asFeatureCollection([turf.asPoint([lng, lat])])
    dispatch({
      type: 'UPDATE_USER_LOCATION',
      coords: [lng, lat],
      userLocFC,
    })
  }
}
export const startTrackingUserLocation = () => {
  return (dispatch) => {
    dispatch({ type: 'START_TRACKING_USER_LOCATION' })
    dispatch(updateUserLocation())
  }
}

export const updateUserLocation = () => {
  return (dispatch) => {
    const geoError = () => {
      dispatch({ type: 'ERROR_IN_POSITIONING' })
    }
    const watchPosition = (pos) => {
      const lng = pos.coords.longitude
      const lat = pos.coords.latitude
      const userLocFC = turf.asFeatureCollection([turf.asPoint([lng, lat])])
      dispatch({
        type: 'UPDATE_USER_LOCATION',
        coords: [lng, lat],
        userLocFC,
      })
    }
    navigator.geolocation.watchPosition(watchPosition, geoError, geoOptions)
  }
}

const withinSupportedArea = (userLocFC) => {
  const userFeat = userLocFC.features[0]
  const extentFeat = extent.features[0]
  return turf.within(userFeat, extentFeat)
}

export default userLocationReducer
