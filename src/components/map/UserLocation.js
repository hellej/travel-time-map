import React from 'react'
import { connect } from 'react-redux'
import { startTrackingUserLocation, mockUserLocation } from './../../reducers/userLocationReducer'

class UserLocation extends React.Component {

    source
    layerId = 'userLocation'
    circleStyle = {
        'circle-color': '#00c7ff',
        'circle-stroke-color': '#00c7ff',
        'circle-radius': 4,
        'circle-stroke-width': 1
    }

    componentDidMount() {
        // this.props.mockUserLocation()
        this.props.startTrackingUserLocation()
        const { map, userLocFC } = this.props
        map.once('load', () => {
            map.addSource(this.layerId, { type: 'geojson', data: userLocFC })
            this.source = map.getSource(this.layerId)
            map.addLayer({ id: this.layerId, source: this.layerId, type: 'circle', paint: this.circleStyle })
        })
    }

    componentDidUpdate = () => {
        if (this.source !== undefined) {
            this.source.setData(this.props.userLocFC)
        } else {
            this.props.map.once('sourcedata', () => this.source.setData(this.props.userLocFC))
        }
    }

    render() {
        return null
    }
}

const mapStateToProps = (state) => ({
    userLocFC: state.userLocation.userLocFC
})
const mapDispatchToProps = {
    startTrackingUserLocation,
    mockUserLocation,
}
const ConnectedUserLocation = connect(mapStateToProps, mapDispatchToProps)(UserLocation)

export default ConnectedUserLocation
