import React, { Component } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { setTransMode, updateTargets } from '../../reducers/targetsReducer'
import { setMapMode } from '../../reducers/zonesReducer'
import Notification from './../Notification'
import { Button } from './Button'
import { IconDiv, SmallIcon, Bird, Bus, Bike, Walk, Car, Refresh } from './StyledIcons'

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
const FlexRow = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    width: max-content;
    margin: 6px 0 0 0;
    justify-content: flex-start;
    align-items: center;
    pointer-events: auto;
`

class Menu extends Component {

    render() {
        const { userLocation, initialTargetsFC, kmTargetsFC, minTargetsFC, zones, setMapMode, setTransMode, updateTargets } = this.props
        const { userLocFC, error } = userLocation
        const transMode = zones.transMode
        const mapMode = zones.mapMode
        if (error !== null) {
            return (
                <LocationMissingMessage>
                    {error}
                </LocationMissingMessage>
            )
        }
        return (
            <OuterFlex>
                <Notification />
                <FlexRow>
                    <Button active={mapMode === 'distance'} onClick={() => setMapMode(userLocFC, initialTargetsFC, kmTargetsFC, minTargetsFC, transMode, 'distance')}>KM</Button>
                    <Button active={mapMode === 'duration'} onClick={() => setMapMode(userLocFC, initialTargetsFC, kmTargetsFC, minTargetsFC, transMode, 'duration')}>MIN</Button>
                    <SmallIcon onClick={() => updateTargets(userLocFC, initialTargetsFC, transMode, mapMode)}> <Refresh /> </SmallIcon>
                </FlexRow>
                <FlexRow>
                    <IconDiv onClick={() => setTransMode(userLocFC, initialTargetsFC, kmTargetsFC, minTargetsFC, 'BIRD', mapMode)} active={transMode === 'BIRD'} disabled={mapMode === 'duration'}> <Bird /> </IconDiv>
                    <IconDiv onClick={() => setTransMode(userLocFC, initialTargetsFC, kmTargetsFC, minTargetsFC, 'WALK', mapMode)} active={transMode === 'WALK'} disabled={false}> <Walk /> </IconDiv>
                    <IconDiv onClick={() => setTransMode(userLocFC, initialTargetsFC, kmTargetsFC, minTargetsFC, 'BICYCLE', mapMode)} active={transMode === 'BICYCLE'} disabled={false}> <Bike /> </IconDiv>
                    <IconDiv onClick={() => setTransMode(userLocFC, initialTargetsFC, kmTargetsFC, minTargetsFC, 'PT', mapMode)} active={transMode === 'PT'} disabled={mapMode === 'distance'}> <Bus /> </IconDiv>
                    <IconDiv onClick={() => setTransMode(userLocFC, initialTargetsFC, kmTargetsFC, minTargetsFC, 'CAR', mapMode)} active={transMode === 'CAR'} disabled={mapMode === 'distance'}> <Car /> </IconDiv>
                </FlexRow>
            </OuterFlex>
        )
    }
}

const mapStateToProps = (state) => ({
    initialTargetsFC: state.targets.initialTargetsFC,
    kmTargetsFC: state.targets.kmTargetsFC,
    minTargetsFC: state.targets.minTargetsFC,
    userLocation: state.userLocation,
    zones: state.zones,
})
const ConnectedMenu = connect(mapStateToProps, { setTransMode, setMapMode, updateTargets })(Menu)

export default ConnectedMenu
