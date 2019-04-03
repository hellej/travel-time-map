import styled, { css } from 'styled-components'
import { FaDove } from 'react-icons/fa'
import { FaBus } from 'react-icons/fa'
import { IoIosBicycle } from 'react-icons/io'
import { IoIosWalk } from 'react-icons/io'
import { IoMdCar } from 'react-icons/io'

export const IconDiv = styled.div`
    border-radius: 8px;
    background-color: #000000b5;
    border: 1px solid white;
    margin: 4px 5px 0px 5px;
    padding: 9px 10px;
    display: table;
    cursor: pointer;
    color: white;
    transition-duration: 0.2s;
    -webkit-transition-duration: 0.2s; /* Safari */
    ${props => props.active === true && css`
        pointer-events: none;
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
    ${props => props.disabled === true && css`
        color: grey;
        border-color: grey;
        pointer-events: none;
    `}
`
export const Bird = styled(FaDove)`
    font-size: 29px;
    vertical-align: middle;
    display: table-cell;
    text-align: center;
`
export const Bus = styled(FaBus)`
    font-size: 30px;
    vertical-align: middle;
    display: table-cell;
    text-align: center;
`
export const Bike = styled(IoIosBicycle)`
    font-size: 30px;
    vertical-align: middle;
    display: table-cell;
    text-align: center;
`
export const Walk = styled(IoIosWalk)`
    font-size: 30px;
    vertical-align: middle;
    display: table-cell;
    text-align: center;
`
export const Car = styled(IoMdCar)`
    font-size: 30px;
    vertical-align: middle;
    display: table-cell;
    text-align: center;
`
