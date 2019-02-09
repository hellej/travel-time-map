import React, { Component } from 'react'
import Map from './components/map/Map'
import UserLocation from './components/map/UserLocation'
import TravelTimeZones from './components/map/TravelTimeZones'
import MapControl from './components/map/MapControl'

class App extends Component {
  render() {
    return (
      <div>
        <Map>
          <MapControl/>
          <UserLocation/>
          <TravelTimeZones/>
        </Map>
      </div>
    )
  }
}

export default App
