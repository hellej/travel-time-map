import React, { Component } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { updateTtTargets } from './../reducers/targetsReducer'

const Button = styled.button`
  pointer-events: auto;
`
class Menu extends Component {

    render() {
        const { userLocFC, targetsFC, updateTtTargets } = this.props
        return (
            <div>
                <Button onClick={() => updateTtTargets(userLocFC, targetsFC)}>asdf</Button>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    targetsFC: state.targets.targetsFC,
    userLocFC: state.userLocation.geoJSONFC,
})

const ConnectedMenu = connect(mapStateToProps, { updateTtTargets })(Menu)

export default ConnectedMenu
