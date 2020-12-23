import React from 'react'
import { StyledSongListContainer, StyledSongListEntry, StyledSongListEntryTitle } from './music-playing-queue.styles'
import { SongQueue } from '@data/song-queue'

interface MusicPlayingQueueProps {
    songQueue: SongQueue
}

/**
 * Component that displays the songs in order of the playing queue,
 * and allows controls to switch the song that is playing.
 */
export class MusicPlayingQueue extends React.Component<MusicPlayingQueueProps> {
    /**
     * Returns list of songs in the playing queue as JSX elements.
     * The active song is highlighted.
     */
    getSongListEntries(): JSX.Element[] {
        const queue = this.props.songQueue

        // Map queue songs to list entries
        // TODO: Optimize this?
        return queue.getAllSongs().map((song, index) => {
            const isActive = song === queue.current()

            return (
                <StyledSongListEntry key={index} isActive={isActive}
                    onClick={() => { queue.changeSong(song) }}
                >
                    <StyledSongListEntryTitle>
                        {song.data.title}
                    </StyledSongListEntryTitle>
                </StyledSongListEntry>
            )
        })
    }

    render() {
        return (
            <StyledSongListContainer>
                {this.getSongListEntries()}
            </StyledSongListContainer>
        )
    }
}