import styled from '@emotion/styled'

export type StyledSongListEntryTitleProps = {
    isActive?: boolean
}

export const StyledSongListContainer = styled.div`
    text-align: center;
    max-height: 300px;
    overflow-y: scroll;
`

export const StyledSongListEntry = styled.div`
    background-color: ${(props:  StyledSongListEntryTitleProps) => props.isActive ? '#aaaaaa' : '#eaeaea'};
    padding-top: 10px;
    padding-bottom: 10px;
    margin-bottom: 5px;
    margin-top: 5px;

    :hover {
        background-color: #cccccc;
    }
`

export const StyledSongListEntryTitle = styled.div`
    padding: 0;
    margin: 0;
    user-select: none;
`