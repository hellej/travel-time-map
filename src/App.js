import React, { Component } from 'react'
import Map from './components/map/Map'
import UserLocation from './components/map/UserLocation'
import TravelTimeZones from './components/map/TravelTimeZones'
import Targets from './components/map/Targets'
import MapControl from './components/map/MapControl'
import { connect } from 'react-redux'
import { updateTargets } from './reducers/targetsReducer'

class App extends Component {

  componentDidMount() {
    this.props.updateTargets()
  }

  render() {
    return (
      <div>
        <Map>
          <MapControl />
          <UserLocation />
          <TravelTimeZones />
          <Targets />
        </Map>
      </div>
    )
  }
}

const ConnectedApp = connect(null, { updateTargets })(App)
export default ConnectedApp
