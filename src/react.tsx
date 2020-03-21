import * as React from 'react';
import * as ReactDOM from 'react-dom';

// IPCRenderer that can be used to send events to main process
const ipc = require('electron').ipcRenderer;
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
        this.state = {file: ""};
        this.playSound = this.playSound.bind(this);
    }

    componentDidMount() {
        ipc.on('loadedFile', (e, data) => {
            this.setState({
                file: data
            });
        })
    }

    playSound() {
        // @ts-ignore
        const file = this.state.file

        // Create sound to play
        let sound = new Howl({
            src: [file]
        });

        // Play the sound
        sound.play();
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