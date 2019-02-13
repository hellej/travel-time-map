import styled from 'styled-components'
import { bool } from 'prop-types'

export const Button = styled.div.attrs(props => ({
    style: ({ display: props.visible ? '' : 'none' })
})
)`
  color: ${props => props.color ? props.color : 'white'}; 
  cursor: pointer;
  padding: 6px 13px;
  border-radius: 8px;
  background-color: #019600;
  margin: 5px 0px;
  font-weight: 400;
  font-size: 22px;
  width: max-content;
  letter-spacing: 1px;
  max-width: 90%;
  overflow: auto;
  height: min-content;
  pointer-events: auto;
  transition-duration: 0.2s;
  -webkit-transition-duration: 0.2s; /* Safari */
  &:hover {
    background-color: #017b00;
    color: white;
  }
  @media (max-width: 500px) {
    font-size: 20px;
    padding: 6px 11px;
  }
`

Button.propTypes = {
    visible: bool
}

Button.defaultProps = {
    visible: true
}
