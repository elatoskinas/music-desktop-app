import { Song } from '@data/music-data'
import React from 'react'
import {
    StyledSongListContainer,
    StyledSongListEntry,
    StyledSongListEntryTitle,
} from './MusicPlayingQueue.styles'

export interface MusicPlayingQueueProps {
    activeSong: Song
    songs: Song[]
    onSongChange: (song: Song) => void
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
        // Map queue songs to list entries
        return this.props.songs.map((song, index) => {
            const isActive = song === this.props.activeSong

            return (
                <StyledSongListEntry
                    key={index}
                    isActive={isActive}
                    onClick={() => {
                        this.props.onSongChange(song)
                    }}
                >
                    <StyledSongListEntryTitle>
                        {song.title}
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
