import React, { Component } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { updateTtTargets } from '../../reducers/targetsReducer'
import { toggleDistanceZones } from '../../reducers/zonesReducer'
import { Button } from './Button'

const Flex = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
`
class Menu extends Component {

    render() {
        const { userLocFC, realTargetsFC, zones, updateTtTargets, toggleDistanceZones } = this.props
        return (
            <Flex>
                {(zones.mode === 'distance')
                    ? <Button onClick={() => updateTtTargets(userLocFC, realTargetsFC)}>Show Travel Times</Button>
                    : <Button onClick={() => toggleDistanceZones(userLocFC, realTargetsFC)}>Show Distances</Button>
                }
            </Flex>
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
