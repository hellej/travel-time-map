import React, { Component } from 'react'
import Map from './components/map/Map'
import UserLocation from './components/map/UserLocation'
import TravelTimeZones from './components/map/TravelTimeZones'

class App extends Component {
  render() {
    return (
      <div>
        <Map>
          <UserLocation/>
          <TravelTimeZones/>
        </Map>
      </div>
    )
  }
}

export default App
