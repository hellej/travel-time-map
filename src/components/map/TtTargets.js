import React from 'react'
import { connect } from 'react-redux'
import { initializeTargets } from '../../reducers/targetsReducer'

class TtTargets extends React.Component {
    layerId = 'ttTargets'
    source
    labelsId = 'ttTargetsLabels'
    labelsSource

    paint = {
        'fill-color': '#ff99f4',
        'fill-opacity': 0.8,
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
        'text-offset': [0.2, 0],
        'text-allow-overlap': true,
        'text-ignore-placement': true,
        'text-field': '{name}',
        'text-font': ['Open Sans Regular'],
        'text-size': 14,
    }

    componentDidMount() {
        this.props.initializeTargets()
        const { map, ttTargetsFC, ttTargetLabelsFC } = this.props
        map.once('load', () => {
            // Add layer
            map.addSource(this.layerId, { type: 'geojson', data: ttTargetsFC })
            this.source = map.getSource(this.layerId)
            map.addLayer({
                id: this.layerId,
                source: this.layerId,
                type: 'fill',
                paint: this.paint,
            }, 'zones')
            // Add labels
            map.addSource(this.labelsId, { type: 'geojson', data: ttTargetLabelsFC })
            this.labelsSource = map.getSource(this.labelsId)
            map.addLayer({
                'id': this.labelsId,
                'type': 'symbol',
                'source': this.labelsId,
                'layout': this.labelLayout,
                'paint': this.labelPaint,
            })
        })
    }

    componentDidUpdate = () => {
        const { map, zones, ttTargetsFC, ttTargetLabelsFC } = this.props
        const visibility = zones.mode === 'distance' ? 'none' : 'visible'

        if (this.source !== undefined) {
            this.source.setData(ttTargetsFC)
            map.setLayoutProperty(this.layerId, 'visibility', visibility)
        } else {
            map.once('sourcedata', () => {
                this.source.setData(ttTargetsFC)
                map.setLayoutProperty(this.layerId, 'visibility', visibility)
            })
        }
        if (this.labelsSource !== undefined) {
            this.labelsSource.setData(ttTargetLabelsFC)
            map.setLayoutProperty(this.labelsId, 'visibility', visibility)
        } else {
            map.once('sourcedata', () => {
                this.labelsSource.setData(ttTargetLabelsFC)
                map.setLayoutProperty(this.labelsId, 'visibility', visibility)
            })
        }
    }

    render() {
        return null
    }
}

const mapStateToProps = (state) => ({
    ttTargetsFC: state.targets.ttTargetsFC,
    ttTargetLabelsFC: state.targets.ttTargetLabelsFC,
    zones: state.zones,
})

const ConnectedTtTargets = connect(mapStateToProps, { initializeTargets })(TtTargets)

export default ConnectedTtTargets
