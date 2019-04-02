import React, { Component } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { updateMinTargets } from '../../reducers/targetsReducer'
import { toggleDistanceZones } from '../../reducers/zonesReducer'
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
        const { userLocFC, kmTargetsFC, zones, updateMinTargets, toggleDistanceZones } = this.props
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
                    <Button active={zones.mode === 'distance'} onClick={() => toggleDistanceZones(userLocFC, kmTargetsFC)}>KM</Button>
                    <Button active={zones.mode === 'duration'} onClick={() => updateMinTargets(userLocFC, kmTargetsFC)}>MIN</Button>
                </Flex>
                <Flex>
                    <IconDiv active={true}> <Bird /> </IconDiv>
                    <IconDiv active={false}> <Walk /> </IconDiv>
                    <IconDiv active={false}> <Bike /> </IconDiv>
                    <IconDiv active={false}> <Bus /> </IconDiv>
                    <IconDiv active={false}> <Car /> </IconDiv>
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
const ConnectedMenu = connect(mapStateToProps, { updateMinTargets, toggleDistanceZones })(Menu)

export default ConnectedMenu
