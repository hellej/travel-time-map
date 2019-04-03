import { GraphQLClient } from 'graphql-request'

const endpoint = 'https://api.digitransit.fi/routing/v1/routers/hsl/index/graphql'
const headers = { 'Content-Type': 'application/json', mode: 'no-cors' }
const client = new GraphQLClient(endpoint, { headers })

const getItineraryQuery = (originCoords, targetCoords) => {
    return `{
        plan(
            from: {lat: ${originCoords[1]}, lon: ${originCoords[0]}}
            to: {lat: ${targetCoords[1]}, lon: ${targetCoords[0]}}
            numItineraries: 3
            ) {
                itineraries {
                    duration
                    walkDistance
                }
            }
        }`
}

const getModeItineraryQuery = (originCoords, targetCoords, mode) => {
    return `{
        plan(
            from: {lat: ${originCoords[1]}, lon: ${originCoords[0]}}
            to: {lat: ${targetCoords[1]}, lon: ${targetCoords[0]}}
            numItineraries: 3
            transportModes: { mode: ${mode} }
            ) {
                itineraries {
                    duration
                    walkDistance
                }
            }
        }`
}

const asMins = (secs) => Math.round(secs / 60)

export const getTravelDistance = async (originCoords, targetCoords, mode) => {
    let data
    if (mode === 'PT') {
        data = await client.request(getItineraryQuery(originCoords, targetCoords))
    } else {
        data = await client.request(getModeItineraryQuery(originCoords, targetCoords, mode))
    }
    return data.plan.itineraries[0].walkDistance
}

export const getTravelTimes = async (originCoords, targetCoords, mode) => {
    let data
    if (mode === 'PT') {
        data = await client.request(getItineraryQuery(originCoords, targetCoords))
    } else {
        data = await client.request(getModeItineraryQuery(originCoords, targetCoords, mode))
    }
    const durations = data.plan.itineraries.map(itin => itin.duration)
    const min = Math.min(...durations)
    const max = Math.max(...durations)
    const range = max - min
    const mean = durations.reduce((acc, value) => acc += value, 0) / durations.length
    const median = min + range / 2
    return {
        min: asMins(min),
        max: asMins(max),
        mean: asMins(mean),
        median: asMins(median),
        range: asMins(range)
    }
}
