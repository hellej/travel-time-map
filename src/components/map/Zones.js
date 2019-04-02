import React from 'react'
import { connect } from 'react-redux'

class Zones extends React.Component {

    source
    layerId = 'zones'
    labelsId = 'zonesLabels'
    lineStyle = {
        'line-color': 'white',
        'line-width': 2,
        'line-opacity': 0.25,
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
                    'text-opacity': 0.8,
                    'text-color': 'white',
                    'text-halo-color': 'black',
                    'text-halo-width': 2
                }
            })
        })
    }

    componentDidUpdate = () => {
        const { map, geoJSONFC, mode } = this.props
        const textColor = mode === 'distance' ? 'white' : '#e8ffd8'
        const lineColor = mode === 'distance' ? '#dde6ff' : 'white'
        if (this.source !== undefined) {
            this.source.setData(geoJSONFC)
            map.setPaintProperty(this.labelsId, 'text-color', textColor)
            map.setPaintProperty(this.layerId, 'line-color', lineColor)
        } else {
            this.props.map.once('sourcedata', () => {
                this.source.setData(this.props.geoJSONFC)
                map.setPaintProperty(this.labelsId, 'text-color', textColor)
                map.setPaintProperty(this.layerId, 'line-color', lineColor)
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
