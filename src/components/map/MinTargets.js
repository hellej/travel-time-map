import React from 'react'
import { connect } from 'react-redux'
import { initializeTargets } from '../../reducers/targetsReducer'

class MinTargets extends React.Component {
    layerId = 'minTargets'
    source
    labelsId = 'minTargetsLabels'
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
        'text-ignore-placement': false,
        'text-field': '{name}',
        'text-font': ['Open Sans Regular'],
        'text-size': 14,
    }

    componentDidMount() {
        this.props.initializeTargets()
        const { map, minTargetsFC, minTargetLabelsFC } = this.props
        map.once('load', () => {
            // Add layer
            map.addSource(this.layerId, { type: 'geojson', data: minTargetsFC })
            this.source = map.getSource(this.layerId)
            map.addLayer({
                id: this.layerId,
                source: this.layerId,
                type: 'fill',
                paint: this.paint,
            }, 'zones')
            // Add labels
            map.addSource(this.labelsId, { type: 'geojson', data: minTargetLabelsFC })
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
        const { map, zones, minTargetsFC, minTargetLabelsFC } = this.props
        const visibility = zones.mapMode === 'distance' ? 'none' : 'visible'

        if (this.source !== undefined) {
            this.source.setData(minTargetsFC)
            map.setLayoutProperty(this.layerId, 'visibility', visibility)
            map.setFilter(this.layerId, ['==', 'transMode', zones.transMode])
        } else {
            map.once('sourcedata', () => {
                this.source.setData(minTargetsFC)
                map.setLayoutProperty(this.layerId, 'visibility', visibility)
                map.setFilter(this.layerId, ['==', 'transMode', zones.transMode])
            })
        }
        if (this.labelsSource !== undefined) {
            this.labelsSource.setData(minTargetLabelsFC)
            map.setLayoutProperty(this.labelsId, 'visibility', visibility)
            map.setFilter(this.labelsId, ['==', 'transMode', zones.transMode])
        } else {
            map.once('sourcedata', () => {
                this.labelsSource.setData(minTargetLabelsFC)
                map.setLayoutProperty(this.labelsId, 'visibility', visibility)
                map.setFilter(this.labelsId, ['==', 'transMode', zones.transMode])
            })
        }
    }

    render() {
        return null
    }
}

const mapStateToProps = (state) => ({
    minTargetsFC: state.targets.minTargetsFC,
    minTargetLabelsFC: state.targets.minTargetLabelsFC,
    zones: state.zones,
})

const ConnectedMinTargets = connect(mapStateToProps, { initializeTargets })(MinTargets)

export default ConnectedMinTargets
