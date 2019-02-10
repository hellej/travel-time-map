import React, { Component } from 'react'
import Map from './components/map/Map'
import UserLocation from './components/map/UserLocation'
import Zones from './components/map/Zones'
import Targets from './components/map/Targets'
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
  top: 10px;
`
const TopLeftPanel = styled(AbsoluteContainer)`
  left: 5px;
  right: 5px;
`

class App extends Component {

  render() {
    return (
      <div>
        <TopLeftPanel>
          <Menu />
        </TopLeftPanel>
        <Map>
          <MapControl />
          <UserLocation />
          <Zones />
          <Targets />
        </Map>
      </div>
    )
  }
}

export default App
