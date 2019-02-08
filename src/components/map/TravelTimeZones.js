import React from 'react'
import { connect } from 'react-redux'

class TravelTimeZones extends React.Component {

    source
    layerId = 'travelTimeZones'
    lineStyle = {
        'line-color': 'white',
        'line-width': 2
    }

    componentDidMount() {
        const { map, geoJSONFC } = this.props
        map.once('load', () => {
            map.addSource(this.layerId, { type: 'geojson', data: geoJSONFC })
            this.source = map.getSource(this.layerId)
            map.addLayer({ id: this.layerId, source: this.layerId, type: 'line', paint: this.lineStyle })
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
    geoJSONFC: state.ttZones.ttZonesFC
})

const ConnectedTravelTimeZones = connect(mapStateToProps, null)(TravelTimeZones)

export default ConnectedTravelTimeZones
