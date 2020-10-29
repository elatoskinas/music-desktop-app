import React from 'react'
import { StyledSongListContainer, StyledSongListEntry, StyledSongListEntryTitle } from './music-playing-queue.styles'
import { SongQueue } from '@data/song-queue'

interface MusicPlayingQueueProps {
    songQueue: SongQueue
}

export class MusicPlayingQueue extends React.Component<MusicPlayingQueueProps> {
    render() {
        const queue = this.props.songQueue

        const songElements = queue.getAllSongs().map(song => {
            const isActive = song.path === queue.getCurrentSong()?.path

            return (
                <StyledSongListEntry key={song.path} isActive={isActive}
                    onClick={() => { queue.changeSong(song) }}
                >
                    <StyledSongListEntryTitle>{song.data.title}</StyledSongListEntryTitle>
                </StyledSongListEntry>
            )
        })

        return (
            <StyledSongListContainer>
                {songElements}
            </StyledSongListContainer>
        )
    }
}