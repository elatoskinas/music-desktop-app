// React imports
import * as React from 'react';
import * as ReactDOM from 'react-dom';

// IPCRenderer that can be used to send events to main process
const ipc = require('electron').ipcRenderer;
const loadSound = require('./music-data.ts').loadSound

class FileSelector extends React.Component<{ onFileChange: Function }, {}> {
    constructor(props) {
        super(props);
    }

    openFileSelection() {
        // Send message to open file selection
        ipc.send('openFileSelection', {
            folders: false
        })
    }

    handleFileChange(path: string) {
        // Load the sound to get the sound data
        let soundData = loadSound(path)

        // Invoke callback for sound change
        this.props.onFileChange(soundData);
    }

    componentDidMount() {
        // Receive 'loadedFile' event which contains the path of the file
        ipc.on('loadedFile', (e, path) => {
            this.handleFileChange(path)
        })
    }

    render() {
        return <button onClick={this.openFileSelection}>Open Directory</button>
    }
}

export = {FileSelector}