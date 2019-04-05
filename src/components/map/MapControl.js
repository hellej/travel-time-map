import React from 'react'
import { connect } from 'react-redux'

class MapControl extends React.Component {

    componentDidUpdate = async (prevProps) => {
        const { map } = this.props
        const { zoomToBbox } = this.props.mapState

        const { userLocHistory } = this.props.userLocation
        if (userLocHistory.length === 1 && prevProps.userLocation.userLocHistory.length === 0) {
            map.easeTo({ center: userLocHistory[0], zoom: 10.6 })
        }
        if (zoomToBbox !== prevProps.mapState.zoomToBbox) map.fitBounds(zoomToBbox)

    }
    render() { return null }
}

const mapStateToProps = (state) => ({
    userLocation: state.userLocation,
    mapState: state.map,
})

const ConnectedMapControl = connect(mapStateToProps)(MapControl)

export default ConnectedMapControl
