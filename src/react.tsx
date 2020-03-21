// React imports
import * as React from 'react';
import * as ReactDOM from 'react-dom';

// CSS  imports
import './css/main.css'

// IPCRenderer that can be used to send events to main process
const ipc = require('electron').ipcRenderer;

// Howl can be used to play sounds
const {Howl, Howler} = require('howler');

/**
 * Button to play/pause sound.
 * Testing for now.
 */
class PlayButton extends React.Component {
    constructor(props) {
        super(props);

        console.log("X")

        // Initialize file to none initially
        this.state = {};
        this.playSound = this.playSound.bind(this);
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
                src: [data]
            });

            // Update state
            this.setState({
                sound: newSound
            });
        })
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
        return <button onClick={this.playSound}>Play Sound</button>;
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