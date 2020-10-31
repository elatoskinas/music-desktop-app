// React imports
import * as React from 'react'

import { Howl } from 'howler'

import { Song, SongData } from '@data/music-data' // eslint-disable-line no-unused-vars
import { IoMdPlay, IoMdPause } from 'react-icons/io'
import { TiMediaStop } from 'react-icons/ti'
import { MdFastRewind, MdFastForward } from 'react-icons/md'

import {FileSelector} from '@frontend/file-components'
import {MusicInfo} from '@frontend/music-info'
import {MusicProgress} from '@frontend/music-progress'
import {PLAY_STATUS} from '@common/status.ts'

import { SongQueue } from '@data/song-queue'

import { StyledMusicControlButton, StyledMusicControlContainer, StyledMusicControllerContainer } from './music-player.styles'
import { MusicPlayingQueue } from './music-playing-queue'

interface PlayButtonProps {
    playSound: any, // TODO: Could replace with more accurate type for callback
    status: string
}

/**
 * Button component to play/pause sound.
 * Contains the played sound and the status of playback as the current properties.
 */
export class PlayButton extends React.Component<PlayButtonProps> {
    buttonIcons = {
        [PLAY_STATUS.STOPPED]: <TiMediaStop />,
        [PLAY_STATUS.PLAYING]: <IoMdPause />,
        [PLAY_STATUS.PAUSED]:  <IoMdPlay />
    }

    render() {
        const status = this.props.status
        const element = this.buttonIcons[status]

        return(
            <StyledMusicControlButton onClick={this.props.playSound} aria-label='Play Button'>
                {element}
            </StyledMusicControlButton>
        )
    }
}

interface ControlButtonProps {
    callback: any
}

/**
 * Button component to rewind sound.
 * When button is clicked, the passed in callback is fired.
 */
export class RewindButton extends React.Component<ControlButtonProps> {
    render() {
        return(
            <StyledMusicControlButton onClick={this.props.callback} aria-label='Rewind Button'>
                <MdFastRewind />
            </StyledMusicControlButton>
        )
    }
}

/**
 * Button component to forward sound.
 * When button is clicked, the passed in callback is fired.
 */
export class ForwardButton extends React.Component<ControlButtonProps> {
    render() {
        return(
            <StyledMusicControlButton onClick={this.props.callback} aria-label='Forward Button'>
                <MdFastForward />
            </StyledMusicControlButton>
        )
    }
}

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
            <div>
                <FileSelector onSoundLoaded={this.onSongLoad} />
                <MusicInfo metadata={this.state.metadata} />
                <MusicPlayingQueue songQueue={this.songQueue} />
                <MusicController sound={this.state.sound}
                    onSongEnded={this.onSongEnded}
                    onPreviousSong={this.onPreviousSong}
                    onNextSong={this.onNextSong}
                />
            </div>
        )
    }
}

interface MusicControllerState {
    status: string,
    duration: number
}

interface MusicControllerProps {
    sound: Howl,
    onSongEnded: Function,
    onPreviousSong: any,
    onNextSong: any
}

/**
 * Component to control the current sound.
 * Contains the current sound being played as state, alongside with the metadata
 * and the status of playback.
 * 
 * Valid status includes 'STOPPED', 'PLAYING' and 'PAUSED'.
 */
export class MusicController extends React.Component<MusicControllerProps, MusicControllerState> {
    constructor(props) {
        super(props)

        this.state = {
            'status': PLAY_STATUS.STOPPED,
            'duration': 0
        }

        this.playSound = this.playSound.bind(this)
    }

    componentDidUpdate(prevProps) {
        if (this.props.sound !== prevProps.sound) {
            if (prevProps.sound != null) {
                // Stop old sound
                prevProps.sound.stop()

                // Remove all callbacks
                prevProps.sound.off()

                // Unload last sound
                // TODO: Should some caching mechanism be used, e.g. for queue?
                prevProps.sound.unload()
            }

            // Reset status to stopped
            this.updateStatus(PLAY_STATUS.STOPPED)

            // Load sound if it exists
            if (this.props.sound != null) {
                this.loadSound(this.props.sound)
            }
        }
    }

    /**
     * Loads a new sound to the music player, and sets up all the neccessary callbacks.
     * @param sound new sound to load
     */
    loadSound(sound: Howl) {
        // Initialize callbacks
        sound.on('play', ()  => this.updateStatus(PLAY_STATUS.PLAYING))
        sound.on('stop', ()  => this.updateStatus(PLAY_STATUS.STOPPED))
        sound.on('end', ()   => {
            this.updateStatus(PLAY_STATUS.STOPPED)
            this.props.onSongEnded()
        })
        sound.on('pause', () => this.updateStatus(PLAY_STATUS.PAUSED))
        sound.on('load', () => {
            this.setState({
                duration: sound.duration()
            })
        })
    }

    /**
     * Updates the playback status.
     * @param newStatus  New status to update to
     */
    updateStatus(newStatus: string) {
        this.setState({
            status: newStatus
        })
    }

    /**
     * Plays/pauses the current active sound, if a sound is loaded.
     */
    playSound() {
        const sound = this.props.sound

        // Play the sound
        if (sound != null) {
            // Pause/play depending on current status
            sound.playing() ? sound.pause() : sound.play()
        }
    }

    render() {
        return(
            <StyledMusicControllerContainer>
                <StyledMusicControlContainer>
                    <RewindButton callback={this.props.onPreviousSong} />
                    <PlayButton playSound={this.playSound} status={this.state.status} />
                    <ForwardButton callback={this.props.onNextSong} />
                </StyledMusicControlContainer>
                <MusicProgress sound={this.props.sound} status={this.state.status} duration={this.state.duration} />
            </StyledMusicControllerContainer>
        )
    }
}