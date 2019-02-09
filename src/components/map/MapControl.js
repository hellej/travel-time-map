import React from 'react'
import { connect } from 'react-redux'

class MapControl extends React.Component {

    componentDidUpdate = async (prevProps) => {
        const { map } = this.props

        const { locationHistory } = this.props.userLocation
        if (locationHistory.length === 1 && prevProps.userLocation.locationHistory.length === 0) {
            map.easeTo({ center: locationHistory[0], zoom: 11.3 })
        }
    }
    render() { return null }
}

const mapStateToProps = (state) => ({
    userLocation: state.userLocation,
})

const ConnectedMapControl = connect(mapStateToProps)(MapControl)

export default ConnectedMapControl
