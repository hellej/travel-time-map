import { GraphQLClient } from 'graphql-request'

const endpoint = 'https://api.digitransit.fi/routing/v1/routers/hsl/index/graphql'
const headers = { 'Content-Type': 'application/json' }
const client = new GraphQLClient(endpoint, { headers })

const getTravelTimesQuery = (originCoords, targetCoords) => {
    return `{
        plan(
            from: {lat: ${originCoords[1]}, lon: ${originCoords[0]}}
            to: {lat: ${targetCoords[1]}, lon: ${targetCoords[0]}}
            numItineraries: 3
            ) {
                itineraries {
                    duration
                }
            }
        }`
}

export const getTravelTimes = async (originCoords, targetCoords) => {
    const data = await client.request(getTravelTimesQuery(originCoords, targetCoords))
    const durations = data.plan.itineraries.map(itin => itin.duration)
    const minmax = { ttmin: Math.min(...durations), ttmax: Math.max(...durations) }
    return { ...minmax, ttrange: minmax.ttmax - minmax.ttmin }
}