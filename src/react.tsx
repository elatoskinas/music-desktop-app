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

// TODO: The code will need heavy refactoring/reworking & testing.
// TODO: Right now, it is inteded to be a minimal version of the app

// TODO: Perhaps rethink/restructure this.
class Song {
    artist: string;
    album: string;
    title: string;
    genre: string;
    tracknumber: number;
    year: number;

    constructor(metadata) {
        // TODO: Generalize this
        this.artist = metadata.artist ? metadata.artist : "Unknown Artist"
        this.album = metadata.album ? metadata.album : "Unknown Album"
        this.title = metadata.title ? metadata.title : "Unknown Title"
        this.genre = metadata.genre ? metadata.genre : "Unknown Genre"
        this.tracknumber = metadata.track ? metadata.track : 1
        this.year = metadata.year ? metadata.year : "Unknown Year"
    }
}

/**
 * Button to play/pause sound.
 * Testing for now.
 */
class PlayButton extends React.Component {
    statusMappings: Record<string, string>;

    constructor(props) {
        super(props);

        this.statusMappings = {
            STOPPED: "Stopped",
            PLAYING: "Playing",
            PAUSED: "Paused"
        }

        this.state = {
            'playStatus': this.statusMappings.STOPPED,
            'duration': 0,
            'timestamp': 0
        };

        // Bind this to callbacks
        this.playSound = this.playSound.bind(this);
    }

    updatePlayStatus(newStatus: string) {
        this.setState({
            playStatus: newStatus
        });
    }

    updateDuration(newDuration: number) {
        this.setState({
            duration: newDuration
        });
    }

    formatTimestamp(time: number) {
        return new Date(time * 1000).toISOString().substr(11, 8)
    }

    componentDidMount() {
        ipc.on('loadedFile', (e, data) => {
            // @ts-ignore
            let oldSound = this.state.sound

            // Stop old sound if it exists
            if (oldSound != null) {
                oldSound.stop();
            }

            // Create new sound to play from path
            let newSound = new Howl({
                src: [data],
                html5: true,

                // TODO: Detect that these events come from the proper sound
                onplay: () => {
                    this.updatePlayStatus(this.statusMappings.PLAYING);
                },

                onstop: () => {
                    this.updatePlayStatus(this.statusMappings.PAUSED);
                },
                
                onpause: () => {
                    this.updatePlayStatus(this.statusMappings.PAUSED);
                },

                onload: () => {
                    this.updateDuration(newSound.duration())
                }
            });

            metadata.parseFile(data).then(
                metadata => {
                    this.setState({
                        musicData: new Song(metadata.common)
                    });
                }
            ).catch( err => {
                console.error(err.message)
            });

            // Update state
            this.setState({
                sound: newSound
            });
        })

        // @ts-ignore
        this.timestamp = setInterval(
            () => {
                // @ts-ignore
                const sound = this.state.sound;

                if (sound != null && sound.state() == 'loaded') {
                    // @ts-ignore
                    let time = this.state.sound.seek()
                    this.setState({
                        'timestamp': time
                    });
                }
            },
            1000
        );
    }

    playSound() {
        // @ts-ignore
        const sound = this.state.sound

        // Play the sound
        if (sound != null) {
            // Pause/play depending on current status
            sound.playing() ? sound.pause() : sound.play();
        }
    }

    render() {
        // @ts-ignore
        const buttonText = this.state.playStatus;

        // @ts-ignore
        const duration = this.state.duration;

        // @ts-ignore
        const time = this.state.timestamp;

        const newProgress = ((duration == 0 ? 0 : time/duration) * 100) + '%'

        // @ts-ignore
        // TODO: Find way to generalize displaying metadata
        const title = this.state.musicData ? this.state.musicData.title : "N/A"

        return(
            <div>
                <button onClick={this.playSound}>
                    {buttonText}
                </button>

                {/* TODO: Split to another component */}
                <p>
                    {
                        this.formatTimestamp(time) + "/" + this.formatTimestamp(duration)
                    }
                </p>

                {/* TODO: Split to another component */}
                <div id="musicProgress">
                    <div id="musicProgressBar" style ={{ width: newProgress }} >
                    </div>
                </div>

                {/* TODO: Split this to another component */}
                <div>
                    <p>{title}</p>
                </div>
            </div>
        );
    }
}

class FileSelectionButton extends React.Component {
    openFileSelection() {
        ipc.send('openFileSelection', {
            folders: false
        })
    }

    render() {
        // @ts-ignore
        // TODO: Type error here in webkitdir/directory?
        return <button onClick={this.openFileSelection}>Open Directory</button>
    }
}

/**
 * Main application component.
 */
class App extends React.Component {
    render() {
        return (
            <div>
                <PlayButton />
                <FileSelectionButton />
            </div>
        );
    }
}
 
ReactDOM.render(<App />, document.getElementById('app'));