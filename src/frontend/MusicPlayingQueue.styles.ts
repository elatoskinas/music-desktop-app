import styled from '@emotion/styled'
import { BASE_STYLE, THEME_COLOURS } from './common-styles'

export type StyledSongListEntryTitleProps = {
    isActive?: boolean
}

export const StyledSongListContainer = styled.div`
    text-align: center;
`

export const StyledSongListEntry = styled.div`
    background-color: ${(props: StyledSongListEntryTitleProps) =>
        props.isActive ? THEME_COLOURS.tertiary : THEME_COLOURS.accentLight};
    padding: ${BASE_STYLE.padding.med} 0;
    margin: ${BASE_STYLE.margin.small} 0;

    :hover {
        background-color: ${THEME_COLOURS.accentDark};
    }
`

export const StyledSongListEntryTitle = styled.div`
    padding: 0;
    margin: 0;
    user-select: none;
`
