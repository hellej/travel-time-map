import React, { Component } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { updateTtTargets } from '../../reducers/targetsReducer'
import { toggleDistanceZones } from '../../reducers/zonesReducer'
import { Button } from './Button'

const OuterFlex = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: left;
`
const Flex = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    width: 200px;
    justify-content: space-evenly;
    pointer-events: auto;
`
const LocationMissingMessage = styled.div`
    color: white;
    margin: auto;
    text-align: center;
    font-size: 31px;
    letter-spacing: 1px;
    font-weight: 300;
    height: 50vh;
`

class Menu extends Component {

    render() {
        const { userLocFC, realTargetsFC, zones, updateTtTargets, toggleDistanceZones } = this.props
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
                    <Button active={zones.mode === 'distance'} onClick={() => toggleDistanceZones(userLocFC, realTargetsFC)}>KM</Button>
                    <Button active={zones.mode === 'duration'} onClick={() => updateTtTargets(userLocFC, realTargetsFC)}>MIN</Button>
                </Flex>
            </OuterFlex>
        )
    }
}

const mapStateToProps = (state) => ({
    realTargetsFC: state.targets.realTargetsFC,
    userLocFC: state.userLocation.geoJSONFC,
    zones: state.zones,
})
const ConnectedMenu = connect(mapStateToProps, { updateTtTargets, toggleDistanceZones })(Menu)

export default ConnectedMenu
