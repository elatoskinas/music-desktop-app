// React imports
import * as React from 'react'

import { GoFileDirectory } from 'react-icons/go'
import { LOADED_SOUND, OPEN_FILE_SELECTION } from '@common/messages.ts'

import { ipcRenderer as ipc } from 'electron'

export interface FileSelectorProps {
    onSoundLoaded: Function
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
        ipc.send(OPEN_FILE_SELECTION.name, OPEN_FILE_SELECTION.data(true))
    }

    componentDidMount() {
        // Receive sound loading event which contains the sound data of the file
        ipc.on(LOADED_SOUND.name, (e, data) => {
            this.props.onSoundLoaded(data.sound)
        })
    }

    render() {
        return (
            <button onClick={this.openFileSelection}>
                <GoFileDirectory />
            </button>
        )
    }
}
