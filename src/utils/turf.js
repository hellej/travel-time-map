import bbox from '@turf/bbox'
import buffer from '@turf/buffer'
import circle from '@turf/circle'
import destination from '@turf/destination'
import distance from '@turf/distance'
import bearing from '@turf/bearing'
import { featureCollection } from '@turf/helpers'
import { point } from '@turf/helpers'

export const asPoint = (coords, properties) => {
  return point(coords, properties)
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
  return circle(center, options.radius, { steps: 100, units: 'meters', properties: options })
}

export const getBearing = (originCoords, destCoords) => {
  return bearing(asPoint(originCoords), asPoint(destCoords))
}

export const getDistance = (originCoords, destCoords) => {
  const dist = distance(asPoint(originCoords), asPoint(destCoords), { units: 'meters' })
  return Math.round(dist)
}

export const getDestination = (originCoords, distance, bearing) => {
  const point = asPoint(originCoords)
  const dest = destination(point, distance, bearing, { units: 'meters' })
  return dest.geometry.coordinates
}

export const combineFCs = (fc1, fc2) => {
  return asFeatureCollection(fc1.features.concat(fc2.features))
}
