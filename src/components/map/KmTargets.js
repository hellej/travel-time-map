import React from 'react'
import { connect } from 'react-redux'
import { initializeTargets } from '../../reducers/targetsReducer'

class KmTargets extends React.Component {

    source
    layerId = 'kmTargets'
    labelsId = 'kmTargetsLabels'

    circlePaint = {
        'circle-color': 'transparent',
        'circle-opacity': 0.7,
        'circle-radius': 5,
        'circle-stroke-width': 2,
        'circle-stroke-color': [
            'match',
            ['get', 'operating'],
            'no', '#ff70ae',
            'yes', '#51ff7c',
            /* other */ '#51ff7c'
        ],
    }
    labelPaint = {
        'text-color': 'white',
        'text-halo-color': 'black',
        'text-halo-blur': 3,
        'text-halo-width': 2
    }
    labelLayout = {
        'symbol-placement': 'point',
        'text-anchor': 'left',
        'text-offset': [0.8, 0],
        'text-allow-overlap': true,
        'text-ignore-placement': false,
        'text-field': '{name}',
        'text-font': ['Open Sans Regular'],
        'text-size': 13,
    }

    componentDidMount() {
        this.props.initializeTargets()
        const { map, kmTargetsFC } = this.props
        map.once('load', () => {
            // Add layer
            map.addSource(this.layerId, { type: 'geojson', data: kmTargetsFC })
            this.source = map.getSource(this.layerId)
            map.addLayer({
                id: this.layerId,
                source: this.layerId,
                type: 'circle',
                paint: this.circlePaint,
            }, 'zones')
            // Add labels
            map.addLayer({
                'id': this.labelsId,
                'type': 'symbol',
                'source': this.layerId,
                'layout': this.labelLayout,
                'paint': this.labelPaint,
            })
            map.on('mouseenter', this.layerId, () => { map.getCanvas().style.cursor = 'pointer' })
            map.on('mouseleave', this.layerId, () => { map.getCanvas().style.cursor = '' })
            map.on('click', this.layerId, (e) => {
                const rpLink = e.features[0].properties.rpLink
                console.log('Clicked feature:', e.features[0])
                console.log('OPEN LINK TO:', rpLink)
                if (window.confirm('Open HSL route planner?')) {
                    window.open(rpLink, '_blank')
                }
            })
        })
    }

    componentDidUpdate = () => {
        const { map, zones, kmTargetsFC } = this.props
        const visibility = zones.mapMode === 'distance' ? 'visible' : 'none'

        if (this.source !== undefined) {
            this.source.setData(kmTargetsFC)
            map.setLayoutProperty(this.layerId, 'visibility', visibility)
            map.setLayoutProperty(this.labelsId, 'visibility', visibility)
            map.setFilter(this.layerId, ['==', 'transMode', zones.transMode])
            map.setFilter(this.labelsId, ['==', 'transMode', zones.transMode])
        } else {
            map.once('sourcedata', () => {
                this.source.setData(kmTargetsFC)
                map.setLayoutProperty(this.layerId, 'visibility', visibility)
                map.setLayoutProperty(this.labelsId, 'visibility', visibility)
                map.setFilter(this.layerId, ['==', 'transMode', zones.transMode])
                map.setFilter(this.labelsId, ['==', 'transMode', zones.transMode])
            })
        }
    }

    render() {
        return null
    }
}

const mapStateToProps = (state) => ({
    kmTargetsFC: state.targets.kmTargetsFC,
    zones: state.zones,
})

const ConnectedKmTargets = connect(mapStateToProps, { initializeTargets })(KmTargets)

export default ConnectedKmTargets
