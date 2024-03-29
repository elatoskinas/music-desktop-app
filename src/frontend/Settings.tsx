import * as React from 'react'
import { AppContext, AppContextState } from './AppContext'
import { OPEN_FILE_SELECTION, RETURN_FILE_SELECTION } from '@common/messages.ts'

import { ipcRenderer as ipc } from 'electron'
import {
    StyledDirectoryContainer,
    StyledDirectoryButton,
} from './Settings.styles'

interface SettingsState {
    scanDirectories: string[]
}

export const SCAN_DIRECTORIES_KEY = 'scan_directories'

export class Settings extends React.Component<{}, SettingsState> {
    static contextType = AppContext

    constructor(props) {
        super(props)

        this.state = {
            scanDirectories: [],
        }
    }

    componentDidMount() {
        const { getPreference, storePreference } = this
            .context as AppContextState

        // Get initial preferences
        getPreference(SCAN_DIRECTORIES_KEY).then((scanDirectoriesValue) => {
            const scanDirectories =
                scanDirectoriesValue != null
                    ? (JSON.parse(scanDirectoriesValue) as string[])
                    : []

            console.log(scanDirectories)

            this.setState({
                scanDirectories: scanDirectories,
            })
        })

        // Receive sound loading event which contains the sound data of the file
        ipc.on(RETURN_FILE_SELECTION.name, (e, data) => {
            const newScanDirs = this.state.scanDirectories.concat(data.folders)
            storePreference(SCAN_DIRECTORIES_KEY, JSON.stringify(newScanDirs))

            this.setState({
                scanDirectories: newScanDirs,
            })
        })
    }

    /**
     * Opens file selection by sending a message from the IPC renderer.
     */
    openFileSelection() {
        // Send message to open file selection
        ipc.send(OPEN_FILE_SELECTION.name, OPEN_FILE_SELECTION.data())
    }

    render() {
        const scanDirectories = this.state.scanDirectories

        const songDirectoriesElements = scanDirectories.map(
            (songDir, index) => {
                // TODO: Add removal option
                return (
                    <StyledDirectoryContainer key={index}>
                        {songDir}
                    </StyledDirectoryContainer>
                )
            }
        )

        return (
            <div>
                <h1>Settings</h1>
                <div>
                    <StyledDirectoryButton onClick={this.openFileSelection}>
                        + Add Directory
                    </StyledDirectoryButton>
                    {songDirectoriesElements}
                </div>
            </div>
        )
    }
}
