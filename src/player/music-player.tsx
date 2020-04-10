// React imports
import * as React from 'react';
import { Song } from '../music-data/music-data';
import { IoMdPlay, IoMdPause } from "react-icons/io";
import { TiMediaStop } from "react-icons/ti";

import {FileSelector} from '@music-data/file-components.tsx'
import {MusicInfo} from '@player/music-info.tsx'
import {MusicProgress} from '@player/music-progress.tsx'
import {PLAY_STATUS} from '@common/status.ts'

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
    metadata: Song
}

/**
 * Component corresponding to a music player that plays one song and displays the
 * information of the song, as well as exposing controls for the song.
 */
export class MusicPlayer extends React.Component<{}, MusicPlayerState> {
    constructor(props) {
        super(props);

        this.state = {
            "sound": undefined,
            "metadata": undefined
        }

        this.onSongLoad = this.onSongLoad.bind(this)
    }

    /**
     * Changes the current active song based on the passed in song & metadata
     * combination.
     * 
     * @param musicData Dictionary consisting of two elements: 'sound' and 'metadata',
     *                  both of which are promises; The sound is a promise for the Howl Sound
     *                  object, and the Metadat is a promise for Song information.
     */
    onSongLoad(musicData: {sound: Promise<Howl>, metadata: Promise<Song>}) {
        // Update sound via promise events
        musicData.sound.then(
            (sound) => this.setState({ sound }),
            (error) => console.log(error)
        )

        // Update metadata via promise events
        musicData.metadata.then(
            (metadata)  => this.setState({ metadata }),
            (error) => console.log(error)
        )
    }

    render() {
        return(
            <div>
                <FileSelector onFileChange={this.onSongLoad} />
                <MusicController sound={this.state.sound} />
                <MusicInfo metadata={this.state.metadata} />
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
        super(props);

        this.state = {
            'status': PLAY_STATUS.STOPPED,
            'duration': 0
        }

        this.playSound = this.playSound.bind(this);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.sound !== prevProps.sound) {
            if (prevProps.sound != null) {
                // Stop old sound
                prevProps.sound.stop()

                // Remove all callbacks
                prevProps.sound.off()
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
        sound.on('play', ()  => this.updateStatus(PLAY_STATUS.PLAYING));
        sound.on('stop', ()  => this.updateStatus(PLAY_STATUS.STOPPED));
        sound.on('end', ()   => this.updateStatus(PLAY_STATUS.STOPPED));
        sound.on('pause', () => this.updateStatus(PLAY_STATUS.PAUSED));
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
        });
    }

    /**
     * Plays/pauses the current active sound, if a sound is loaded.
     */
    playSound() {
        const sound = this.props.sound

        // Play the sound
        if (sound != null) {
            // Pause/play depending on current status
            sound.playing() ? sound.pause() : sound.play();
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