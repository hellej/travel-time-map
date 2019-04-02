import React, { Component } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { updateMinTargets, updateKmTargets } from '../../reducers/targetsReducer'
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
        const { userLocFC, kmTargetsFC, zones, updateMinTargets, updateKmTargets } = this.props
        const transMode = zones.transMode
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
                    <Button active={zones.mode === 'distance'} onClick={() => updateKmTargets(userLocFC, kmTargetsFC)}>KM</Button>
                    <Button active={zones.mode === 'duration'} onClick={() => updateMinTargets(userLocFC, kmTargetsFC, zones.transMode)}>MIN</Button>
                </Flex>
                <Flex>
                    <IconDiv active={transMode === 'BIRD'}> <Bird /> </IconDiv>
                    <IconDiv active={transMode === 'WALK'}> <Walk /> </IconDiv>
                    <IconDiv active={transMode === 'BICYCLE'}> <Bike /> </IconDiv>
                    <IconDiv active={transMode === 'PT'}> <Bus /> </IconDiv>
                    <IconDiv active={transMode === 'CAR'}> <Car /> </IconDiv>
                </Flex>
            </OuterFlex>
        )
    }
}

const mapStateToProps = (state) => ({
    kmTargetsFC: state.targets.kmTargetsFC,
    userLocFC: state.userLocation.geoJSONFC,
    zones: state.zones,
})
const ConnectedMenu = connect(mapStateToProps, { updateMinTargets, updateKmTargets })(Menu)

export default ConnectedMenu
