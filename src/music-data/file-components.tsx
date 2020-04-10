// React imports
import * as React from 'react'

import { GoFileDirectory } from 'react-icons/go'
import { LOADED_FILE, OPEN_FILE_SELECTION } from '@common/messages.ts'

import { ipcRenderer as ipc } from 'electron'
import {loadSound} from '@music-data/file-loader.ts'

interface FileSelectorProps {
    onFileChange: Function
}

/**
 * Component for selecting files. Takes in a single callback that is invoked after
 * a file is selected.
 */
export class FileSelector extends React.Component<FileSelectorProps> {
    constructor(props) {
        super(props)
    }

    /**
     * Opens file selection by sending a message from the IPC renderer.
     */
    openFileSelection() {
        // Send message to open file selection
        ipc.send(OPEN_FILE_SELECTION.name, OPEN_FILE_SELECTION.data(false))
    }

    /**
     * Handles loading a sound after a path is selected in file selection.
     * @param path Path of the file that was loaded
     */
    handleFileLoad(path: string) {
        // Load the sound to get the sound data
        let soundData = loadSound(path)

        // Invoke callback for sound change
        this.props.onFileChange(soundData)
    }

    componentDidMount() {
        // Receive 'loadedFile' event which contains the path of the file
        ipc.on(LOADED_FILE.name, (e, data) => {
            this.handleFileLoad(data.filePath)
        })
    }

    render() {
        return <GoFileDirectory onClick={this.openFileSelection} />
    }
}