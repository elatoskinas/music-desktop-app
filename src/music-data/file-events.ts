import { ipcMain, dialog } from 'electron'
import { LOADED_FILE, OPEN_FILE_SELECTION, LOAD_FILES_FROM_PATHS } from '@common/messages.ts'
import * as fileLoader from '@music-data/file-loader.ts'

module.exports = (function() {
    // Open directory event
    ipcMain.on(OPEN_FILE_SELECTION.name, (ev, data) => {
        // Get property for file selection
        const fileSelectProperty = data.useFolders ? 'openDirectory' : 'openFile'

        // Open dialog for file selection (enable multi-selection mode)
        let promise = dialog.showOpenDialog({properties: [fileSelectProperty, 'multiSelections']})

        // Setup a promise to send the response
        promise.then(function(success) {
            // If file selection was not cancelled, then process selected file paths
            if (!success.canceled) {
                // Construct file callback to send back to event
                let replyCallback = function fileSendCallback(filePath) {
                    ev.reply(LOADED_FILE.name, LOADED_FILE.data(filePath))
                }

                fileLoader.processSoundFilePaths(success.filePaths, replyCallback)
            }
        }, function(error) {
            console.log(error)
        })
    })
})()

export {}