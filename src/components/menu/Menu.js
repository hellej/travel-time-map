import React, { Component } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { updateTtTargets } from '../../reducers/targetsReducer'
import { Button } from './Button'

const Flex = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
`
class Menu extends Component {

    render() {
        const { userLocFC, realTargetsFC, updateTtTargets, zones } = this.props
        return (
            <Flex>
                {(zones.mode === 'distance')
                    ? <Button onClick={() => updateTtTargets(userLocFC, realTargetsFC)}>Show Travel Times</Button>
                    : <Button onClick={() => updateTtTargets(userLocFC, realTargetsFC)}>Show Distances</Button>
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

const ConnectedMenu = connect(mapStateToProps, { updateTtTargets })(Menu)

export default ConnectedMenu
