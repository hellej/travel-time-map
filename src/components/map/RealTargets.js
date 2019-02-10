import React from 'react'
import { connect } from 'react-redux'
import { initializeTargets } from '../../reducers/targetsReducer'

class RealTargets extends React.Component {

    source
    layerId = 'realTargets'
    labelsId = 'realTargetsLabels'

    circlePaint = {
        'circle-color': 'transparent',
        'circle-opacity': 0.5,
        'circle-radius': 6,
        'circle-stroke-width': 2,
        'circle-stroke-color': '#ff99f4',
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
        'text-ignore-placement': true,
        'text-field': '{name}',
        'text-font': ['Open Sans Regular'],
        'text-size': 13,
    }

    componentDidMount() {
        this.props.initializeTargets()
        const { map, realTargetsFC } = this.props
        map.once('load', () => {
            // Add layer
            map.addSource(this.layerId, { type: 'geojson', data: realTargetsFC })
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
        })
    }

    componentDidUpdate = () => {
        const { map, zones, realTargetsFC } = this.props
        const visibility = zones.mode === 'distance' ? 'visible' : 'none'

        if (this.source !== undefined) {
            this.source.setData(realTargetsFC)
            map.setLayoutProperty(this.layerId, 'visibility', visibility)
            map.setLayoutProperty(this.labelsId, 'visibility', visibility)
        } else {
            map.once('sourcedata', () => {
                this.source.setData(realTargetsFC)
                map.setLayoutProperty(this.layerId, 'visibility', visibility)
            })
        }
    }

    render() {
        return null
    }
}

const mapStateToProps = (state) => ({
    realTargetsFC: state.targets.realTargetsFC,
    zones: state.zones,
})

const ConnectedRealTargets = connect(mapStateToProps, { initializeTargets })(RealTargets)

export default ConnectedRealTargets
