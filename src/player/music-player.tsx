// React imports
import * as React from 'react'

import { Howl } from 'howler'

import { Song, SongData } from '@music-data/music-data.ts' // eslint-disable-line no-unused-vars
import { IoMdPlay, IoMdPause } from 'react-icons/io'
import { TiMediaStop } from 'react-icons/ti'

import {FileSelector} from '@music-data/file-components.tsx'
import {MusicInfo} from '@player/music-info.tsx'
import {MusicProgress} from '@player/music-progress.tsx'
import {PLAY_STATUS} from '@common/status.ts'

import '@css/music-player.css'

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
            <button onClick={this.props.playSound} aria-label='Play Button'>
                {element}
            </button>
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
    constructor(props) {
        super(props)

        this.state = {
            'sound': undefined,
            'metadata': undefined
        }

        this.onSongLoad = this.onSongLoad.bind(this)
    }

    onSongLoad(musicData: Song) {
        const sound = new Howl({
            src: [musicData.path],
            html5: true
        })

        this.setState({
            sound,
            metadata: musicData.data
        })
    }

    render() {
        return(
            <div>
                <MusicInfo metadata={this.state.metadata} />
                <FileSelector onFileChange={this.onSongLoad} />
                <MusicController sound={this.state.sound} />
            </div>
        )
    }
}

interface MusicControllerState {
    status: string,
    duration: number
}

interface MusicControllerProps {
    sound: Howl
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
        sound.on('end', ()   => this.updateStatus(PLAY_STATUS.STOPPED))
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
            <div>
                <PlayButton playSound={this.playSound} status={this.state.status} />
                <MusicProgress sound={this.props.sound} status={this.state.status} duration={this.state.duration} />
            </div>
        )
    }
}