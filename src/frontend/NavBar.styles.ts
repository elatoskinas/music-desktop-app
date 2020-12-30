import styled from '@emotion/styled'
import { BASE_STYLE, THEME_COLOURS } from './common-styles'

export const StyledNavBarContainer = styled.div`
    height: 100%;
    background-color: ${THEME_COLOURS.secondary};
`

export const StyledNavBarContent = styled.div`
    padding: ${BASE_STYLE.padding.med};
    display: flex;
    flex-flow: column;
    justify-content: center;
`

export const StyledNavBarButton = styled.button`
    width: 40px;
    height: 40px;
    border: none;
    margin-bottom: 10px;
    background-color: ${THEME_COLOURS.primary};
    border-radius: 10px;
`
