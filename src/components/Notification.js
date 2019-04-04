import React from 'react'
import { connect } from 'react-redux'
import styled, { css } from 'styled-components'

const StyledNotificationDiv = styled.div`
  margin: 5px 6px;
  padding: 4px 9px;
  border-radius: 5px;
  border: 1px solid grey;
  width: max-content;
  color: white;
  background: rgba(0, 0, 0, 0.74);
  display: inline-block;
  line-height: 1.5;
  font-size: 23px;
  font-weight: 300;
  letter-spacing: 1.3px;
  ${props => props.look === 'error' && css`
    color: #ff7ff3;
    border-color: #ff7ff3ab;
  `}
`

const Notification = (props) => {
  if (props.notification.text === null) return null

  return (
    <StyledNotificationDiv look={props.notification.look}>
      {props.notification.text}
    </StyledNotificationDiv>
  )
}

const mapStateToProps = (state) => ({
  notification: state.notification
})

const ConnectedNotification = connect(mapStateToProps, null)(Notification)

export default ConnectedNotification
