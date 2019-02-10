import React from 'react'
import { connect } from 'react-redux'
import { initializeTargets } from '../../reducers/targetsReducer'

class Targets extends React.Component {

    layerId = 'targets'
    source
    lablesId = 'targetsLabels'
    labelsSource
    fillStyle = {
        'fill-color': '#89ffff',
        'fill-opacity': 0.6,
    }

    componentDidMount() {
        this.props.initializeTargets()
        const { map, targetsFC, labelsFC } = this.props
        map.once('load', () => {
            // Add layer
            map.addSource(this.layerId, { type: 'geojson', data: targetsFC })
            this.source = map.getSource(this.layerId)
            map.addLayer({
                id: this.layerId,
                source: this.layerId,
                type: 'fill',
                paint: this.fillStyle,
            }, 'zones')
            // Add labels
            map.addSource(this.lablesId, { type: 'geojson', data: labelsFC })
            this.labelsSource = map.getSource(this.lablesId)
            map.addLayer({
                'id': this.lablesId,
                'type': 'symbol',
                'source': this.lablesId,
                'layout': {
                    'symbol-placement': 'point',
                    'text-anchor': 'left',
                    'text-font': ['Open Sans Regular'],
                    'text-field': '{name}',
                    'text-size': 13,
                },
                'paint': {
                    'text-color': 'white',
                    'text-halo-color': 'black',
                    'text-halo-width': 2
                }
            })
        })
    }

    componentDidUpdate = () => {
        if (this.source !== undefined) {
            this.source.setData(this.props.targetsFC)
        } else {
            this.props.map.once('sourcedata', () => this.source.setData(this.props.targetsFC))
        }
        if (this.labelsSource !== undefined) {
            this.labelsSource.setData(this.props.labelsFC)
        } else {
            this.props.map.once('sourcedata', () => this.labelsSource.setData(this.props.labelsFC))
        }
    }

    render() {
        return null
    }
}

const mapStateToProps = (state) => ({
    targetsFC: state.targets.targetsFC,
    labelsFC: state.targets.targetLabelsFC,
})

const ConnectedTargets = connect(mapStateToProps, { initializeTargets })(Targets)

export default ConnectedTargets
