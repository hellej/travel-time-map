import React, { Component } from 'react'
import Map from './components/map/Map'
import UserLocation from './components/map/UserLocation'
import TravelTimeZones from './components/map/TravelTimeZones'
import Targets from './components/map/Targets'
import MapControl from './components/map/MapControl'

class App extends Component {

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

export default App
