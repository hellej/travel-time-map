import React, { Component } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { updateMinTargets, updateKmTargets, setTransMode } from '../../reducers/targetsReducer'
import { Button } from './Button'
import { IconDiv, Bird, Bus, Bike, Walk, Car } from './StyledIcons'

const LocationMissingMessage = styled.div`
    color: white;
    margin: auto;
    text-align: center;
    font-size: 31px;
    letter-spacing: 1px;
    font-weight: 300;
    height: 50vh;
`
const OuterFlex = styled.div`
    display: flex;
    flex-direction: column;
    margin: 0 10px 0 10px;
`
const Flex = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    width: max-content;
    margin: 10px 0 0 0;
    justify-content: flex-start;
    pointer-events: auto;
`

class Menu extends Component {

    render() {
        const { userLocFC, kmTargetsFC, minTargetsFC, zones, updateMinTargets, updateKmTargets, setTransMode } = this.props
        const transMode = zones.transMode
        const mapMode = zones.mapMode
        if (userLocFC.features.length === 0) {
            return (
                <LocationMissingMessage>
                    Waiting for location...
                </LocationMissingMessage>
            )
        }
        return (
            <OuterFlex>
                <Flex>
                    <Button active={mapMode === 'distance'} onClick={() => updateKmTargets(userLocFC, kmTargetsFC, transMode)}>KM</Button>
                    <Button active={mapMode === 'duration'} onClick={() => updateMinTargets(userLocFC, kmTargetsFC, transMode)}>MIN</Button>
                </Flex>
                <Flex>
                    <IconDiv onClick={() => setTransMode(userLocFC, kmTargetsFC, minTargetsFC, 'BIRD', mapMode)} active={transMode === 'BIRD'}> <Bird /> </IconDiv>
                    <IconDiv onClick={() => setTransMode(userLocFC, kmTargetsFC, minTargetsFC, 'WALK', mapMode)} active={transMode === 'WALK'}> <Walk /> </IconDiv>
                    <IconDiv onClick={() => setTransMode(userLocFC, kmTargetsFC, minTargetsFC, 'BICYCLE', mapMode)} active={transMode === 'BICYCLE'}> <Bike /> </IconDiv>
                    <IconDiv onClick={() => setTransMode(userLocFC, kmTargetsFC, minTargetsFC, 'PT', mapMode)} active={transMode === 'PT'}> <Bus /> </IconDiv>
                    <IconDiv onClick={() => setTransMode(userLocFC, kmTargetsFC, minTargetsFC, 'CAR', mapMode)} active={transMode === 'CAR'}> <Car /> </IconDiv>
                </Flex>
            </OuterFlex>
        )
    }
}

const mapStateToProps = (state) => ({
    kmTargetsFC: state.targets.kmTargetsFC,
    minTargetsFC: state.targets.minTargetsFC,
    userLocFC: state.userLocation.geoJSONFC,
    zones: state.zones,
})
const ConnectedMenu = connect(mapStateToProps, { updateMinTargets, updateKmTargets, setTransMode })(Menu)

export default ConnectedMenu
