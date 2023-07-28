import styled from '@emotion/styled'
import { BASE_STYLE, THEME_COLOURS } from './common-styles'

export const StyledDirectoryContainer = styled.div`
    background-color: ${THEME_COLOURS.accentLight};
    margin: ${BASE_STYLE.margin.med} 0;
    padding: ${BASE_STYLE.padding.med};
`

export const StyledDirectoryButton = styled.button`
    width: 100%;
    background-color: ${THEME_COLOURS.accentLight};
    padding: ${BASE_STYLE.padding.med};
    outline: none;
    text-align: left;
    border: none;
`
