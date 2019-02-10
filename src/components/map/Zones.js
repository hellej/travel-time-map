import React from 'react'
import { connect } from 'react-redux'

class Zones extends React.Component {

    source
    layerId = 'zones'
    labelId = 'zonesLabels'
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
                'id': this.labelId,
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
        if (this.source !== undefined) {
            this.source.setData(this.props.geoJSONFC)
        } else {
            this.props.map.once('sourcedata', () => this.source.setData(this.props.geoJSONFC))
        }
    }

    render() {
        return null
    }
}

const mapStateToProps = (state) => ({
    geoJSONFC: state.zones.zonesFC
})

const ConnectedZones = connect(mapStateToProps, null)(Zones)

export default ConnectedZones
