import React from 'react'
import { connect } from 'react-redux'
import { initializeTargets } from '../../reducers/targetsReducer'

class RealTargets extends React.Component {

    source
    layerId = 'realTargets'
    labelsId = 'realTargetsLabels'

    labelLayout = {
        'symbol-placement': 'point',
        'icon-allow-overlap': true,
        'text-anchor': 'left',
        'text-offset': [1.2, 0],
        'text-font': ['Open Sans Regular'],
        'text-field': '{name}',
        'text-size': 13,
    }
    circlePaint = {
        'circle-color': 'white',
        'circle-opacity': 0.5,
        'circle-radius': 9,
        'circle-stroke-width': 2,
        'circle-stroke-color': 'white',
    }
    labelPaint = {
        'text-color': 'white',
        'text-halo-color': 'black',
        'text-halo-width': 2
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
