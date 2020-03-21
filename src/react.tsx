// React imports
import * as React from 'react';
import * as ReactDOM from 'react-dom';

// CSS  imports
import './css/main.css'

// IPCRenderer that can be used to send events to main process
const ipc = require('electron').ipcRenderer;

// Howl can be used to play sounds
const {Howl, Howler} = require('howler');

// TODO: The code will need heavy refactoring/reworking & testing.
// TODO: Right now, it is inteded to be a minimal version of the app

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