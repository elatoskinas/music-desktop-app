import styled from '@emotion/styled'
import { BASE_STYLE, THEME_COLOURS } from './common-styles'

export const StyledMusicControlContainer = styled.div`
    display: flex;
    align-content: center;
    justify-content: center;
`

export const StyledMusicControllerContainer = styled.div`
    padding: ${BASE_STYLE.margin.med};
    background-color: ${THEME_COLOURS.secondary};
`
export const StyledMusicControlButton = styled.button`
    height: 48px;
    width: 48px;
    margin: 0 ${BASE_STYLE.margin.med};
    background-color: ${THEME_COLOURS.accentLight};
    border-color: #000000;
    border-radius: 100%;
    border-width: 1.5px;
    transition: ease 0.1s;
    outline: none;
    text-decoration: none;

    :hover {
        background-color: ${THEME_COLOURS.primary};
    }

    :active {
        background-color: ${THEME_COLOURS.accentDark};
        border-color: ${THEME_COLOURS.primary};
    }
`
