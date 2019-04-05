import { turf } from './index'

export const createLabelPoints = (FC) => {
    const features = FC.features.map(feature => {
        const centreCoords = feature.properties.centreCoords
        const offsetCoords = turf.getDestination(centreCoords, feature.properties.radius, 90)
        return turf.asPoint(offsetCoords, feature.properties)
    })
    return turf.asFeatureCollection(features)
}

export const getRoutePlannerLink = (userCoords, feat, transMode) => {
    const baseUrl = 'https://reittiopas.hsl.fi/reitti/'
    const toCoords = feat.properties.realCoords
    const fromString = 'Current location ::' + userCoords[1] + ',' + userCoords[0]
    const toString = feat.properties.name + '::' + toCoords[1] + ',' + toCoords[0]
    const modeString = transMode === 'CAR' ? 'CAR,CAR_PARK' : transMode
    const url = baseUrl + fromString + '/' + toString + '?modes=' + modeString
    return encodeURI(url)
}

export const updateDistancesToTargets = (userCoords, kmTargetsFC) => {
    const features = kmTargetsFC.features.map(feature => {
        const distance = turf.getDistance(userCoords, feature.properties.realCoords)
        return { ...feature, properties: { ...feature.properties, distance } }
    })
    return turf.asFeatureCollection(features)
}

export const updateRoutePlannerLinksToTargets = (userCoords, FC) => {
    const features = FC.features.map(feature => {
        const mode = feature.properties.transMode
        const transMode = mode === 'BIRD' ? 'PT' : mode
        const rpLink = getRoutePlannerLink(userCoords, feature, transMode)
        return { ...feature, properties: { ...feature.properties, rpLink } }
    })
    return turf.asFeatureCollection(features)
}

export const getNClosestFeats = (FC, n) => {
    const features = FC.features.sort((feat1, feat2) => feat1.properties.distance - feat2.properties.distance)
    return features.slice(0, n)
}
