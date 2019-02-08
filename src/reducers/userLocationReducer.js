import { turf } from '../utils/index'

const geoOptions = {
  enableHighAccuracy: true,
  maximumAge: 30000,
  timeout: 27000
}
const initialUserLocation = {
  expireTime: '',
  error: null,
  geoJSON: null,
  geoJSONFC: turf.asFeatureCollection([]),
  locationHistory: [],
}
const geoError = () => {
  console.log('no location available')
}

const userLocationReducer = (store = initialUserLocation, action) => {

  switch (action.type) {
    case 'UPDATE_USER_LOCATION': {
      const locationHistory = store.locationHistory
      return {
        ...store,
        locationHistory: locationHistory.concat(action.lngLat),
        geoJSON: action.geoJSON,
        geoJSONFC: action.geoJSONFC,
      }
    }
    case 'RESET_USER_LOCATION':
      return initialUserLocation

    default:
      return store
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
      const geoJSON = turf.asPoint([lng, lat])
      const geoJSONFC = turf.asFeatureCollection([geoJSON])
      dispatch({
        type: 'UPDATE_USER_LOCATION',
        lngLat: { lng, lat },
        geoJSON,
        geoJSONFC,
      })
    }
    navigator.geolocation.watchPosition(watchPosition, geoError, geoOptions)
  }
}

export default userLocationReducer
