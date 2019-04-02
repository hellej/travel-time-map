import styled, { css } from 'styled-components'
import { bool } from 'prop-types'

export const Button = styled.div.attrs(props => ({
  style: ({ display: props.visible ? '' : 'none', })
})
)`
  cursor: pointer;
  padding: 6px 13px;
  border: 1px solid;
  border-radius: 8px;
  margin: 5px 6px;
  font-weight: 300;
  font-size: 28px;
  width: max-content;
  letter-spacing: 1px;
  max-width: 90%;
  overflow: auto;
  height: min-content;
  pointer-events: auto;
  transition-duration: 0.2s;
  -webkit-transition-duration: 0.2s; /* Safari */
  ${props => props.active === true && css`
    color: #46ff66;
    border-color: #46ff66;
    pointer-events: none;
  `}
  ${props => props.active === false && css`
    color: white;
    border-color: white;
    &:hover { 
      color: #46ff66;
      border-color: #46ff66;
    }
  `}
`

Button.propTypes = {
  visible: bool
}

Button.defaultProps = {
  visible: true
}
