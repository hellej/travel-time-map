import styled from 'styled-components'
import { bool } from 'prop-types'

export const Button = styled.div.attrs(props => ({
    style: ({ display: props.visible ? '' : 'none' })
})
)`
  color: ${props => props.color ? props.color : 'white'}; 
  cursor: pointer;
  padding: 6px 11px;
  border-radius: 8px;
  background-color: #24af24;
  margin: 5px 0px;
  font-weight: 400;
  font-size: 18px;
  width: max-content;
  max-width: 90%;
  overflow: auto;
  height: min-content;
  pointer-events: auto;
  transition-duration: 0.1s;
  -webkit-transition-duration: 0.1s; /* Safari */
  &:hover {
    margin-left: 2px;
  }
  @media (max-width: 500px) {
    font-size: 15px;
    padding: 6px 11px;
  }
`

Button.propTypes = {
    visible: bool
}

Button.defaultProps = {
    visible: true
}
