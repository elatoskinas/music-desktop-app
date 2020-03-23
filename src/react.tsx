// React imports
import * as React from 'react';
import * as ReactDOM from 'react-dom';

// CSS  imports
import './css/main.css'

// IPCRenderer that can be used to send events to main process
const ipc = require('electron').ipcRenderer;

// Howl can be used to play sounds
const {Howl, Howler} = require('howler');

// Music metadata extraction
const metadata = require('music-metadata');

const {Song} = require('./music-data.ts')
const {FileSelector} = require('./file-components.tsx')

// TODO: The code will need heavy refactoring/reworking & testing.
// TODO: Right now, it is inteded to be a minimal version of the app

/**
 * Button to play/pause sound.
 * Testing for now.
 */
class PlayButton extends React.Component<{ playSound: any, status: string }, {}> {
    render() {
        // @ts-ignore
        // TODO: Find way to generalize displaying metadata
        //const title = this.state.musicData ? this.state.musicData.title : "N/A"
        const title = "NA"

        return(
            <div>
                <button onClick={this.props.playSound}>
                    {this.props.status}
                </button>

                {/* TODO: Split this to another component */}
                <div>
                    <p>{title}</p>
                </div>
            </div>
        );
    }
}

class MusicProgress extends React.Component<{ sound: any }, { duration: number, time: number }> {
    // TODO: Set appropriate type
    timeInterval: any;

    constructor(props) {
        super(props);

        this.state = {
            'duration': 0,
            'time': 0
        };
    }

    formatTimestamp(time: number) {
        return new Date(time * 1000).toISOString().substr(11, 8)
    }

    componentDidMount() {
        // Time interval (progress bar)
        this.timeInterval = setInterval(
            () => {
                const sound = this.props.sound;

                if (sound != null && sound.state() == 'loaded') {
                    this.setState({
                        'duration': sound.duration(), // Get duration
                        'time': sound.seek() // Get current position TODO: Replace with onseek?
                    });
                }
            },
            1000
        );
    }

    getProgress(time, duration) {
        return ((duration == 0 ? 0 : time/duration) * 100)
    }

    render() {
        const time = this.state.time
        const duration = this.state.duration

        // Get progress value to use as width for progress bar
        const newProgress = this.getProgress(time, duration) + '%'

        return (
            <div>
                <p>
                    {
                        this.formatTimestamp(time) + "/" + this.formatTimestamp(duration)
                    }
                </p>

                <div id="musicProgress">
                    <div id="musicProgressBar" style ={{ width: newProgress }} >
                    </div>
                </div>
            </div>
        )
    }
}

class MusicController extends React.Component<{}, { sound: any, metadata: Record<string, any>, status: string }> {
    statusMappings = {
        STOPPED: "Stopped",
        PLAYING: "Playing",
        PAUSED: "Paused"
    }

    constructor(props) {
        super(props);

        this.state = {sound: undefined, metadata: {}, status: this.statusMappings.STOPPED }
        this.onFileChange = this.onFileChange.bind(this);
        this.playSound = this.playSound.bind(this);
    }

    onFileChange(musicData) {
        let sound = musicData.sound

        // Stop old sound, if it exists
        if (this.state.sound != null) {
            this.state.sound.stop();
        }

        // Initialize callbacks
        // TODO: Detect that these come from proper sound
        sound.on('play', () => this.updateStatus(this.statusMappings.PLAYING));
        sound.on('stop', () => this.updateStatus(this.statusMappings.PAUSED));
        sound.on('pause', () => this.updateStatus(this.statusMappings.PAUSED));
        // TODO: Missing load metadata

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

    updateStatus(newStatus: string) {
        this.setState({
            status: newStatus
        });
    }

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
                <PlayButton playSound={this.playSound} status={this.state.status} />
                <FileSelector onFileChange={this.onFileChange} />
                <MusicProgress sound={this.state.sound} />
            </div>
        )
    }
}

/**
 * Main application component.
 */
class App extends React.Component {
    render() {
        return (
            <div>
                <MusicController />
            </div>
        );
    }
}
 
ReactDOM.render(<App />, document.getElementById('app'));