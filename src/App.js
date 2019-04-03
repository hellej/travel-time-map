import React, { Component } from 'react'
import Notification from './components/Notification'
import Map from './components/map/Map'
import UserLocation from './components/map/UserLocation'
import Zones from './components/map/Zones'
import KmTargets from './components/map/KmTargets'
import MinTargets from './components/map/MinTargets'
import MapControl from './components/map/MapControl'
import Menu from './components/menu/Menu'
import styled from 'styled-components'

const AbsoluteContainer = styled.div`
  position: absolute;
  pointer-events: none;
  z-index: 2;
`
const BottomPanel = styled(AbsoluteContainer)`
  bottom: 17px;
  left: 0px;
  right: 0px;
`

class App extends Component {

  render() {
    return (
      <div>
        <Notification />
        <BottomPanel>
          <Menu />
        </BottomPanel>
        <Map>
          <MapControl />
          <UserLocation />
          <Zones />
          <KmTargets />
          <MinTargets />
        </Map>
      </div>
    )
  }
}

export default App
