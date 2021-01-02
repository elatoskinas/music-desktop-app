import * as React from 'react'
import { ipcRenderer as ipc } from 'electron'
import { GET_SONGS, RETURN_SONGS } from '@common/messages'
import { Song } from '@data/music-data'
import { AppContext, AppContextState } from './AppContext'

import {
    StyledSongListContainer,
    StyledSongListEntry,
    StyledSongListEntryTitle,
} from './MusicPlayingQueue.styles'

interface GalleryState {
    songs: Song[]
}

/**
 * Gallery displaying songs loaded by the app
 * TODO: Refresh functionality
 */
export class Gallery extends React.Component<{}, GalleryState> {
    static contextType = AppContext

    constructor(props) {
        super(props)

        this.state = {
            songs: [],
        }
    }

    componentDidMount() {
        ipc.send(GET_SONGS.name, GET_SONGS.data())
        ipc.on(RETURN_SONGS.name, (e, data) => {
            this.setState({
                songs: data.songs,
            })
        })
    }

    render() {
        const { queueSong } = this.context as AppContextState

        const songElements = this.state.songs.map((song, index) => {
            return (
                <StyledSongListEntry
                    key={index}
                    onClick={() => {
                        queueSong(song)
                    }}
                >
                    <StyledSongListEntryTitle>
                        {song.title}
                    </StyledSongListEntryTitle>
                </StyledSongListEntry>
            )
        })

        return <StyledSongListContainer>{songElements}</StyledSongListContainer>
    }
}
