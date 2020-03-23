// React imports
import * as React from 'react';
import * as ReactDOM from 'react-dom';

// CSS  imports
import './css/main.css'

const {Song} = require('./music-data.ts')
const {FileSelector} = require('./file-components.tsx')

/**
 * Button component to play/pause sound.
 * Contains the played sound and the status of playback as the current properties.
 * 
 * TODO: Resolve 'any' type?
 */
class PlayButton extends React.Component<{ playSound: any, status: string }, {}> {
    render() {
        return(
            <div>
                <button onClick={this.props.playSound}>
                    {this.props.status}
                </button>
            </div>
        );
    }
}

/**
 * Component to display sound progress info with regards to the duration.
 * Contains the current sound as the property, and keeps track of the sound duration
 * & time for the state.
 * 
 * TODO: Resolve 'any' type?
 */
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

/**
 * Component to display music info, such as the title, artist or album.
 * Has song metadata as the properties that is a Song object containing relevant metadata.
 * 
 * TODO: Resolve 'any' type?
 */
class MusicInfo extends React.Component<{ metadata : any }, {}> {
    constructor(props) {
        super(props);
    }

    render() {
        const meta = this.props.metadata;

        if (meta) {
            return (
                <div>
                    <p>Title: {meta.title}</p>
                    <p>Artist: {meta.artist}</p>
                    <p>Album: {meta.album}</p>
                </div>
            )
        }

        return null
    }
}

/**
 * Component to control the current sound.
 * Contains the current sound being played as state, alongside with the metadata
 * and the status of playback.
 * 
 * Valid status includes 'STOPPED', 'PLAYING' and 'PAUSED'.
 * 
 * TODO: Resolve 'any' types?
 */
class MusicController extends React.Component<{}, { sound: any, metadata: any, status: string }> {
    statusMappings = {
        STOPPED: "Stopped",
        PLAYING: "Playing",
        PAUSED: "Paused"
    }

    constructor(props) {
        super(props);

        this.state = {sound: undefined, metadata: undefined, status: this.statusMappings.STOPPED }
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

        // Update state with new sound
        this.setState({
            sound: sound
        })

        musicData.metadata.then(
            (meta) => {
                this.setState({
                    metadata: new Song(meta.common)
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
                <FileSelector onFileChange={this.onFileChange} />
                <PlayButton playSound={this.playSound} status={this.state.status} />
                <MusicProgress sound={this.state.sound} />
                <MusicInfo metadata={this.state.metadata} />
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

// Render application
ReactDOM.render(<App />, document.getElementById('app'));