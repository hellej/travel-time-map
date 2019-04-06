import { turf, utils } from '../utils/index'

const initialMapState = {
  initialized: false,
  zoomToBbox: [],
  center: {},
  zoom: 0,
  mouseOnFeature: null,
}

const mapReducer = (store = initialMapState, action) => {

  switch (action.type) {

    case 'INITIALIZE_MAP':
      return { ...store, initialized: true }

    case 'UPDATE_MIN_TARGETS':
      return { ...store, zoomToBbox: turf.getBbox(turf.getBuffer(action.minTargetsFC, 1500)) }

    case 'UPDATE_KM_TARGETS': {
      const FC = turf.asFeatureCollection(utils.getNClosestFeats(action.kmTargetsFC, 10))
      return { ...store, zoomToBbox: turf.getBbox(turf.getBuffer(FC, 1600)) }
    }

    case 'UPDATE_CAMERA':
      return { ...store, center: action.center, zoom: action.zoom }

    case 'SET_MOUSEON_FEATURE': {
      if (action.feature === undefined) return { ...store, mouseOnFeature: null }
      return { ...store, mouseOnFeature: action.feature }
    }

    default:
      return store
  }
}

export const initializeMap = () => {
  return { type: 'INITIALIZE_MAP' }
}

export const zoomToFeature = (feature) => {
  return { type: 'ZOOM_TO_FEATURE', feature }
}

export const updateCamera = (center, zoom) => {
  return { type: 'UPDATE_CAMERA', center, zoom }
}

export const setMouseOnFeature = (feature) => {
  return { type: 'SET_MOUSEON_FEATURE', feature }
}

export default mapReducer
