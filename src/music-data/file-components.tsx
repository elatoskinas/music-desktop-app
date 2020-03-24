// React imports
import * as React from 'react';
import * as ReactDOM from 'react-dom';

// IPCRenderer that can be used to send events to main process
const ipc = require('electron').ipcRenderer;
const fileLoader = require('./file-loader.ts')

/**
 * Component for selecting files. Takes in a single callback that is invoked after
 * a file is selected.
 */
export class FileSelector extends React.Component<{ onFileChange: Function }, {}> {
    constructor(props) {
        super(props);
    }

    /**
     * Opens file selection by sending a message from the IPC renderer.
     */
    openFileSelection() {
        // Send message to open file selection
        // TODO: Modularize message name
        ipc.send('openFileSelection', {
            folders: false
        })
    }

    /**
     * Handles loading a sound after a path is selected in file selection.
     * @param path Path of the file that was loaded
     */
    handleFileLoad(path: string) {
        // Load the sound to get the sound data
        let soundData = fileLoader.loadSound(path)

        // Invoke callback for sound change
        this.props.onFileChange(soundData);
    }

    componentDidMount() {
        // Receive 'loadedFile' event which contains the path of the file
        ipc.on('loadedFile', (e, path) => {
            this.handleFileLoad(path)
        })
    }

    render() {
        return <button onClick={this.openFileSelection}>Open Directory</button>
    }
}