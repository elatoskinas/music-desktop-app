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
