import React, { Component } from 'react'
import Map from './components/map/Map'
import UserLocation from './components/map/UserLocation'
import Zones from './components/map/Zones'
import RealTargets from './components/map/RealTargets'
import TtTargets from './components/map/TtTargets'
import MapControl from './components/map/MapControl'
import Menu from './components/menu/Menu'
import styled from 'styled-components'

const AbsoluteContainer = styled.div`
  position: absolute;
  z-index: 2;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  pointer-events: none;
`
const BottomPanel = styled(AbsoluteContainer)`
  bottom: 5px;
  left: 0px;
  right: 0px;
`

class App extends Component {

  render() {
    return (
      <div>
        <BottomPanel>
          <Menu />
        </BottomPanel>
        <Map>
          <MapControl />
          <UserLocation />
          <Zones />
          <RealTargets />
          <TtTargets />
        </Map>
      </div>
    )
  }
}

export default App
