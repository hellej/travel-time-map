import React, { Component } from 'react'
import styled, { css } from 'styled-components'
import { connect } from 'react-redux'
import { updateTtTargets } from '../../reducers/targetsReducer'
import { toggleDistanceZones } from '../../reducers/zonesReducer'
import { Button } from './Button'
import { FaDove } from 'react-icons/fa'
import { FaBus } from 'react-icons/fa'
import { IoIosBicycle } from 'react-icons/io'
import { IoIosWalk } from 'react-icons/io'
import { IoMdCar } from 'react-icons/io'

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
const IconDiv = styled.div`
    border-radius: 8px;
    border: 1px solid white;
    margin: 4px 5px 0px 5px;
    padding: 9px 10px;
    display: table;
    cursor: pointer;
    color: white;
    transition-duration: 0.2s;
    -webkit-transition-duration: 0.2s; /* Safari */
    ${props => props.active === true && css`
        color: #00fff7;
        border-color: #00fff7;
        pointer-events: none;
    `}
    ${props => props.active === false && css`
        color: white;
        border-color: white;
        &:hover { 
            color: #00fff7;
            border-color: #00fff7;
        }
    `}
`
const Bird = styled(FaDove)`
    font-size: 29px;
    vertical-align: middle;
    display: table-cell;
    text-align: center;
`
const Bus = styled(FaBus)`
    font-size: 30px;
    vertical-align: middle;
    display: table-cell;
    text-align: center;
`
const Bike = styled(IoIosBicycle)`
    font-size: 30px;
    vertical-align: middle;
    display: table-cell;
    text-align: center;
`
const Walk = styled(IoIosWalk)`
    font-size: 30px;
    vertical-align: middle;
    display: table-cell;
    text-align: center;
`
const Car = styled(IoMdCar)`
    font-size: 30px;
    vertical-align: middle;
    display: table-cell;
    text-align: center;
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
                <Flex>
                    <IconDiv active={true}> <Bird /> </IconDiv>
                    <IconDiv active={false}> <Bus /> </IconDiv>
                    <IconDiv active={false}> <Bike /> </IconDiv>
                    <IconDiv active={true}> <Walk /> </IconDiv>
                    <IconDiv active={false}> <Car /> </IconDiv>
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
