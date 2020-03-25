// React imports
import * as React from 'react';
import { Song } from '../music-data/music-data';
import { IoMdPlay, IoMdPause } from "react-icons/io";
import { TiMediaStop } from "react-icons/ti";

const {FileSelector} = require('@music-data/file-components.tsx')
const {MusicInfo} = require('@player/music-info.tsx')
const {MusicProgress} = require('@player/music-progress.tsx')

let playbackStates = {
    STOPPED: "Stopped",
    PLAYING: "Playing",
    PAUSED: "Paused"
}

/**
 * Button component to play/pause sound.
 * Contains the played sound and the status of playback as the current properties.
 */
export class PlayButton extends React.Component<{ playSound: any, status: string }, {}> {
    buttonIcons = {
        [playbackStates.STOPPED]: <TiMediaStop />,
        [playbackStates.PLAYING]: <IoMdPause />,
        [playbackStates.PAUSED]: <IoMdPlay />
    }

    render() {
        const status = this.props.status
        const element = this.buttonIcons[status]

        return(
            <div>
                {
                    React.cloneElement(
                        element,
                        {onClick: this.props.playSound}
                    )
                }
           </div>
        )
    }
}

/**
 * Component to control the current sound.
 * Contains the current sound being played as state, alongside with the metadata
 * and the status of playback.
 * 
 * Valid status includes 'STOPPED', 'PLAYING' and 'PAUSED'.
 */
export class MusicController extends React.Component<{}, { sound: Howl, metadata: Song, status: string }> {
    constructor(props) {
        super(props);

        this.state = {sound: undefined, metadata: undefined, status: playbackStates.STOPPED }
        this.onFileChange = this.onFileChange.bind(this);
        this.playSound = this.playSound.bind(this);
    }

    /**
     * Changes the current active song based on the passed in song & metadata
     * combination.
     * 
     * TODO: Type annotatiaon
     * @param musicData 
     */
    onFileChange(musicData) {
        let sound = musicData.sound

        // Stop old sound, if it exists
        if (this.state.sound != null) {
            this.state.sound.stop();
        }

        // Initialize callbacks
        // TODO: Detect that these come from proper sound
        sound.on('play', () => this.updateStatus(playbackStates.PLAYING));
        sound.on('stop', () => this.updateStatus(playbackStates.PAUSED));
        sound.on('pause', () => this.updateStatus(playbackStates.PAUSED));

        // Update state with new sound
        this.setState({
            sound: sound
        })

        musicData.metadata.then(
            (meta) => {
                this.setState({
                    metadata: meta
                });
            },
            (error) => console.log(error)
        )
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
        const sound = this.state.sound

        // Play the sound
        if (sound != null) {
            // Pause/play depending on current status
            sound.playing() ? sound.pause() : sound.play();
        }
    }

    render() {
        return(
            <div>
                <FileSelector onFileChange={this.onFileChange} />
                <PlayButton playSound={this.playSound} status={this.state.status} />
                <MusicProgress sound={this.state.sound} />
                <MusicInfo metadata={this.state.metadata} />
            </div>
        )
    }
}