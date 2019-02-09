import React from 'react'
import { connect } from 'react-redux'

class MapControl extends React.Component {

    componentDidUpdate = async (prevProps) => {
        const { map } = this.props

        const { userLocHistory } = this.props.userLocation
        if (userLocHistory.length === 1 && prevProps.userLocation.userLocHistory.length === 0) {
            map.easeTo({ center: userLocHistory[0], zoom: 11.3 })
        }
    }
    render() { return null }
}

const mapStateToProps = (state) => ({
    userLocation: state.userLocation,
})

const ConnectedMapControl = connect(mapStateToProps)(MapControl)

export default ConnectedMapControl
