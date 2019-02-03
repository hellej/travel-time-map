import React, { Component } from 'react'
import Map from './components/map/Map'
import UserLocation from './components/map/UserLocation'

class App extends Component {
  render() {
    return (
      <div>
        <Map>
          <UserLocation/>
        </Map>
      </div>
    )
  }
}

export default App
