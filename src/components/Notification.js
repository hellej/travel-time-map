import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'

const StyledNotificationContainer = styled.div`
  position: absolute; 
  z-index: 4;
  right: 53px;
  top: 10px;
  left: 20px; 
  margin: auto;
`
const StyledNotificationDiv = styled.div`
  margin: auto;
  border-radius: 4px;
  width: max-content;
  color: white;
  background: rgba(0, 0, 0, 0.74);
  display: inline-block;
  line-height: 1.5;
  font-size: 20px;
  font-weight: 400;
  letter-spacing: 1.5px;
  padding: 5px;
`

const Notification = (props) => {
  if (props.notification.text === null) return null

  return (
    <StyledNotificationContainer>
      <StyledNotificationDiv>
        {props.notification.text}
      </StyledNotificationDiv>
    </StyledNotificationContainer>
  )
}

const mapStateToProps = (state) => ({
  notification: state.notification
})

const ConnectedNotification = connect(mapStateToProps, null)(Notification)

export default ConnectedNotification
