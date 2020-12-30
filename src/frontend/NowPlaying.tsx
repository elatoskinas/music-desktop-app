// React imports
import * as React from 'react'

import { Song } from '@data/music-data' // eslint-disable-line no-unused-vars

import { MusicInfo } from '@frontend/MusicInfo'

import { SongQueue } from '@data/song-queue'

import { StyledMusicPlayerContentContainer } from './MusicPlayer.styles'
import { MusicPlayingQueue } from './MusicPlayingQueue'
import { AppContext, AppContextState } from './AppContext'

export class NowPlaying extends React.Component<{}, {}> {
    static contextType = AppContext

    songQueue: SongQueue

    constructor(props) {
        super(props)
    }

    render() {
        const { activeSong, queuedSongs, changeSong } = this
            .context as AppContextState

        return (
            <StyledMusicPlayerContentContainer>
                <MusicInfo metadata={activeSong} />
                <MusicPlayingQueue
                    songs={queuedSongs}
                    activeSong={activeSong}
                    onSongChange={(song: Song) => {
                        changeSong(song)
                    }}
                />
            </StyledMusicPlayerContentContainer>
        )
    }
}
