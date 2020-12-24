// React imports
import * as React from 'react'

import { Howl } from 'howler'

import { Song, SongData } from '@data/music-data' // eslint-disable-line no-unused-vars

import {FileSelector} from '@frontend/FileSelector'
import {MusicInfo} from '@frontend/MusicInfo'

import { SongQueue } from '@data/song-queue'

import { StyledMusicPlayerContainer, StyledMusicPlayerContentContainer, StyledMusicPlayerContentPanel, StyledMusicPlayerNavBarContainer, StyledMusicPlayerNavBarContent } from './MusicPlayer.styles'
import { MusicPlayingQueue } from './MusicPlayingQueue'
import { MusicController } from './MusicController'

interface MusicPlayerState {
    sound: Howl,
    metadata: SongData
}

/**
 * Component corresponding to a music player that plays one song and displays the
 * information of the song, as well as exposing controls for the song.
 */
export class MusicPlayer extends React.Component<{}, MusicPlayerState> {
    songQueue: SongQueue

    constructor(props) {
        super(props)

        this.state = {
            'sound': undefined,
            'metadata': undefined
        }

        this.songQueue = new SongQueue()
        this.songQueue.onSongChangeListener = (song: Song) => {
            this.loadSound(song, true)
        }

        this.onSongLoad = this.onSongLoad.bind(this)
        this.onSongEnded = this.onSongEnded.bind(this)
        this.onNextSong = this.onNextSong.bind(this)
        this.onPreviousSong = this.onPreviousSong.bind(this)
    }

    /**
     * Event call for when the provided Song is loaded.
     * 
     * @param musicData Music data of the song that was loaded
     */
    onSongLoad(musicData: Song) {
        // Add song to queue
        this.songQueue.addSong(musicData)

        // Current song loaded should be played, as it
        // got inserted as the first song in the queue.
        if (this.songQueue.current() === musicData) {
            this.loadSound(musicData, false)
        } else {
            // TODO: For now, force update to update playing queue.
            //       In the future, this functionality will change, so
            //       for now using a workaround for testing.
            this.forceUpdate()
        }
    }

    /**
     * Event call for when the current Song has ended.
     */
    onSongEnded() {
        // Play next song if there is another song to play
        if (this.songQueue.hasNext()) {
            this.loadSound(this.songQueue.next(), true)
        }
    }

    /**
     * Event call when the player is forwarded to the next song.
     */
    onNextSong() {
        this.loadSound(this.songQueue.next(), true)
    }

    /**
     * Event call when the player is forwarded to the previous song.
     */
    onPreviousSong() {
        this.loadSound(this.songQueue.previous(), true)
    }

    /**
     * Loads the Song from the provided data, and plays the song if the
     * flag is set.
     * 
     * @param musicData Song data
     * @param play If true, the song will start playing
     */
    private loadSound(musicData: Song, play: boolean) {
        const sound = new Howl({
            src: [musicData.path],
            html5: true
        })

        this.setState({
            sound,
            metadata: musicData.data
        })

        if (play) {
            sound.play()
        }
    }

    render() {
        return(
            <StyledMusicPlayerContainer>
                <StyledMusicPlayerContentPanel>
                    <StyledMusicPlayerNavBarContainer>
                        <StyledMusicPlayerNavBarContent>
                            <FileSelector onSoundLoaded={this.onSongLoad} />
                        </StyledMusicPlayerNavBarContent>
                    </StyledMusicPlayerNavBarContainer>

                    <StyledMusicPlayerContentContainer>
                        <MusicInfo metadata={this.state.metadata} />
                        <MusicPlayingQueue songQueue={this.songQueue} />
                    </StyledMusicPlayerContentContainer>
                </StyledMusicPlayerContentPanel>

                <MusicController sound={this.state.sound}
                    onSongEnded={this.onSongEnded}
                    onPreviousSong={this.onPreviousSong}
                    onNextSong={this.onNextSong}
                />
            </StyledMusicPlayerContainer>
        )
    }
}

