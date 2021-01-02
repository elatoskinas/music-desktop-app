import * as React from 'react'
import { Howl } from 'howler'

import { PLAY_STATUS } from '@common/status.ts'
import { IoMdPlay, IoMdPause } from 'react-icons/io'
import { TiMediaStop } from 'react-icons/ti'
import { MdFastRewind, MdFastForward } from 'react-icons/md'
import {
    StyledMusicControlButton,
    StyledMusicControlContainer,
    StyledMusicControllerContainer,
} from './MusicController.styles'
import { MusicProgress } from './MusicProgressBar'
import { Song } from '@data/music-data'

export interface MusicControllerProps {
    song: Song
    onPreviousSong: () => void
    onNextSong: () => void
    onSongEnded: () => void
}

interface MusicControllerState {
    sound: Howl
    status: string
    duration: number
}

export interface PlayButtonProps {
    playSound: any // TODO: Could replace with more accurate type for callback
    status: string
}

export interface ControlButtonProps {
    callback: any
}

const BUTTON_ICONS = {
    [PLAY_STATUS.STOPPED]: <TiMediaStop />,
    [PLAY_STATUS.PLAYING]: <IoMdPause />,
    [PLAY_STATUS.PAUSED]: <IoMdPlay />,
}

/**
 * Button component to play/pause sound.
 * Contains the played sound and the status of playback as the current properties.
 */
export function PlayButton(props: PlayButtonProps) {
    return (
        <StyledMusicControlButton
            onClick={props.playSound}
            aria-label="Play Button"
        >
            {BUTTON_ICONS[props.status]}
        </StyledMusicControlButton>
    )
}

/**
 * Button component to rewind sound.
 * When button is clicked, the passed in callback is fired.
 */
export function RewindButton(props: ControlButtonProps) {
    return (
        <StyledMusicControlButton
            onClick={props.callback}
            aria-label="Rewind Button"
        >
            <MdFastRewind />
        </StyledMusicControlButton>
    )
}

/**
 * Button component to forward sound.
 * When button is clicked, the passed in callback is fired.
 */
export function ForwardButton(props: ControlButtonProps) {
    return (
        <StyledMusicControlButton
            onClick={props.callback}
            aria-label="Forward Button"
        >
            <MdFastForward />
        </StyledMusicControlButton>
    )
}

/**
 * Component to control the current sound.
 * Contains the current sound being played as state, alongside with the metadata
 * and the status of playback.
 *
 * Valid status includes 'STOPPED', 'PLAYING' and 'PAUSED'.
 */
export class MusicController extends React.Component<
    MusicControllerProps,
    MusicControllerState
> {
    constructor(props) {
        super(props)

        this.state = {
            sound: null,
            status: PLAY_STATUS.STOPPED,
            duration: 0,
        }

        this.playSound = this.playSound.bind(this)
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.song !== prevProps.song) {
            this.loadSong(this.props.song)
        }

        if (this.state.sound !== prevState.sound) {
            if (prevState.sound != null) {
                // Stop old sound
                prevState.sound.stop()

                // Remove all callbacks
                prevState.sound.off()

                // Unload last sound
                // TODO: Should some caching mechanism be used, e.g. for queue?
                prevState.sound.unload()
            }

            // Reset status to stopped
            this.updateStatus(PLAY_STATUS.STOPPED)

            // Load sound if it exists
            if (this.state.sound != null) {
                this.loadSound(this.state.sound)
            }
        }
    }

    /**
     * Loads the Song from the provided data, and plays the song if the
     * flag is set.
     *
     * @param musicData Song data
     * @param play If true, the song will start playing
     */
    loadSong(musicData: Song) {
        const sound = new Howl({
            src: [musicData.path],
            html5: true,
        })

        this.setState({
            sound,
        })

        sound.play()
    }

    /**
     * Loads a new sound to the music player, and sets up all the neccessary callbacks.
     * @param sound new sound to load
     */
    loadSound(sound: Howl) {
        // Initialize callbacks
        sound.on('play', () => this.updateStatus(PLAY_STATUS.PLAYING))
        sound.on('stop', () => this.updateStatus(PLAY_STATUS.STOPPED))
        sound.on('end', () => {
            this.updateStatus(PLAY_STATUS.STOPPED)
            this.props.onSongEnded()
        })
        sound.on('pause', () => this.updateStatus(PLAY_STATUS.PAUSED))
        sound.on('load', () => {
            this.setState({
                duration: sound.duration(),
            })
        })
    }

    /**
     * Updates the playback status.
     * @param newStatus  New status to update to
     */
    updateStatus(newStatus: string) {
        this.setState({
            status: newStatus,
        })
    }

    /**
     * Plays/pauses the current active sound, if a sound is loaded.
     */
    playSound() {
        const sound = this.state.sound

        // Play the sound
        if (sound != null) {
            // Pause/play depending on current status
            sound.playing() ? sound.pause() : sound.play()
        }
    }

    render() {
        return (
            <StyledMusicControllerContainer>
                <StyledMusicControlContainer>
                    <RewindButton callback={this.props.onPreviousSong} />
                    <PlayButton
                        playSound={this.playSound}
                        status={this.state.status}
                    />
                    <ForwardButton callback={this.props.onNextSong} />
                </StyledMusicControlContainer>
                <MusicProgress
                    sound={this.state.sound}
                    status={this.state.status}
                    duration={this.state.duration}
                />
            </StyledMusicControllerContainer>
        )
    }
}
