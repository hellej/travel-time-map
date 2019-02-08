import bbox from '@turf/bbox'
import buffer from '@turf/buffer'
import circle from '@turf/circle'
import { featureCollection } from '@turf/helpers'
import { point } from '@turf/helpers'

export const asPoint = (coords) => {
  return point(coords)
}

export const asFeatureCollection = (feature) => {
  return featureCollection(feature)
}

export const getBuffer = (geojsonFeature, dist) => {
  return buffer(geojsonFeature, dist, { units: 'meters' })
}

export const getBbox = (geojsonFeature) => {
  return bbox(geojsonFeature)
}

export const getCircle = (center, options) => {
  return circle(center, options.radius, { steps: 120, units: 'meters', properties: options })
}
