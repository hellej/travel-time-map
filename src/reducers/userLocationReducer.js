import { turf } from '../utils/index'

const geoOptions = {
  enableHighAccuracy: true,
  maximumAge: 30000,
  timeout: 27000,
}
const initialUserLocation = {
  expireTime: '',
  error: null,
  geoJSONFC: turf.asFeatureCollection([]),
  userLocHistory: [],
}
const geoError = () => {
  console.log('no location available')
}

const userLocationReducer = (store = initialUserLocation, action) => {

  switch (action.type) {
    case 'UPDATE_USER_LOCATION': {
      return {
        ...store,
        geoJSONFC: action.geoJSONFC,
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
  const lng = 24.93312835
  const lat = 60.16910312
  const geoJSONFC = turf.asFeatureCollection([turf.asPoint([lng, lat])])
  return {
    type: 'UPDATE_USER_LOCATION',
    coords: [lng, lat],
    geoJSONFC,
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
    const watchPosition = (pos) => {
      const lng = pos.coords.longitude
      const lat = pos.coords.latitude
      const geoJSONFC = turf.asFeatureCollection([turf.asPoint([lng, lat])])
      dispatch({
        type: 'UPDATE_USER_LOCATION',
        coords: [lng, lat],
        geoJSONFC,
      })
    }
    navigator.geolocation.watchPosition(watchPosition, geoError, geoOptions)
  }
}

export default userLocationReducer
