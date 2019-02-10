import React, { Component } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { updateTtTargets } from '../../reducers/targetsReducer'
import { Button } from './Button'

const Flex = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
`
class Menu extends Component {

    render() {
        const { userLocFC, targetsFC, updateTtTargets } = this.props
        return (
            <Flex>
                <Button onClick={() => updateTtTargets(userLocFC, targetsFC)}>Find Pools</Button>
                <Button onClick={() => updateTtTargets(userLocFC, targetsFC)}>Show Travel Times</Button>
            </Flex>
        )
    }
}

const mapStateToProps = (state) => ({
    targetsFC: state.targets.targetsFC,
    userLocFC: state.userLocation.geoJSONFC,
})

const ConnectedMenu = connect(mapStateToProps, { updateTtTargets })(Menu)

export default ConnectedMenu
