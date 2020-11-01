import styled from '@emotion/styled'
import { BASE_STYLE, THEME_COLOURS } from './common-styles'

export const StyledMusicPlayerContainer = styled.div`
    display: flex;
    flex-flow: column;
    height: 100%;
`

export const StyledMusicPlayerContentContainer = styled.div`
    height: 100%;
    width: 100%;
    overflow-y: auto;
`

export const StyledMusicPlayerNavBarContainer = styled.div`
    height: 100%;
    background-color: ${THEME_COLOURS.secondary};
`

export const StyledMusicPlayerNavBarContent = styled.div`
    padding: ${BASE_STYLE.padding.med};
`

export const StyledMusicPlayerContentPanel = styled.div`
    height: 100%;
    display: flex;
    flex-flow: row;
    overflow-y: auto;
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

export const StyledMusicControlContainer = styled.div`
    display: flex;
    align-content: center;
    justify-content: center;
`
export const StyledMusicControllerContainer = styled.div`
    padding: ${BASE_STYLE.margin.med};
    background-color: ${THEME_COLOURS.secondary};
`