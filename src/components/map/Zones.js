import React from 'react'
import { connect } from 'react-redux'

class Zones extends React.Component {

    source
    layerId = 'zones'
    labelsId = 'zonesLabels'
    lineStyle = {
        'line-color': 'white',
        'line-width': 1,
        'line-opacity': 0.5,
    }

    componentDidMount() {
        const { map, geoJSONFC } = this.props
        map.once('load', () => {
            map.addSource(this.layerId, { type: 'geojson', data: geoJSONFC })
            this.source = map.getSource(this.layerId)
            map.addLayer({
                id: this.layerId,
                source: this.layerId,
                type: 'line',
                paint: this.lineStyle,
            })
            map.addLayer({
                'id': this.labelsId,
                'type': 'symbol',
                'source': this.layerId,
                'layout': {
                    'symbol-placement': 'line',
                    'text-font': ['Open Sans Regular'],
                    'text-field': '{zoneLabel}',
                    'text-size': 13,
                    'symbol-spacing': 320,
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
        const { map, geoJSONFC, mode } = this.props
        const textColor = mode === 'distance' ? 'white' : '#d8fffc'
        if (this.source !== undefined) {
            this.source.setData(geoJSONFC)
            map.setPaintProperty(this.labelsId, 'text-color', textColor)
        } else {
            this.props.map.once('sourcedata', () => {
                this.source.setData(this.props.geoJSONFC)
                map.setPaintProperty(this.labelsId, 'text-color', textColor)
            })
        }
    }

    render() {
        return null
    }
}

const mapStateToProps = (state) => ({
    geoJSONFC: state.zones.zonesFC,
    mode: state.zones.mode,
})

const ConnectedZones = connect(mapStateToProps, null)(Zones)

export default ConnectedZones