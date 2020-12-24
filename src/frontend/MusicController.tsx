import * as React from 'react'

import {PLAY_STATUS} from '@common/status.ts'
import { IoMdPlay, IoMdPause } from 'react-icons/io'
import { TiMediaStop } from 'react-icons/ti'
import { MdFastRewind, MdFastForward } from 'react-icons/md'
import { StyledMusicControlButton, StyledMusicControlContainer, StyledMusicControllerContainer } from './MusicController.styles'
import { MusicProgress } from './MusicProgressBar'

export interface MusicControllerProps {
    sound: Howl,
    onSongEnded: Function,
    onPreviousSong: any,
    onNextSong: any
}

interface MusicControllerState {
    status: string,
    duration: number
}

export interface PlayButtonProps {
    playSound: any, // TODO: Could replace with more accurate type for callback
    status: string
}

export interface ControlButtonProps {
    callback: any
}

const BUTTON_ICONS = {
    [PLAY_STATUS.STOPPED]: <TiMediaStop />,
    [PLAY_STATUS.PLAYING]: <IoMdPause />,
    [PLAY_STATUS.PAUSED]:  <IoMdPlay />
}

/**
 * Button component to play/pause sound.
 * Contains the played sound and the status of playback as the current properties.
 */
export function PlayButton(props: PlayButtonProps) {
    return (
        <StyledMusicControlButton onClick={props.playSound} aria-label='Play Button'>
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
        <StyledMusicControlButton onClick={props.callback} aria-label='Rewind Button'>
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
        <StyledMusicControlButton onClick={props.callback} aria-label='Forward Button'>
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
