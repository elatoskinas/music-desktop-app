import { ipcMain, dialog } from 'electron'
import { LOADED_FILE, OPEN_FILE_SELECTION } from '@common/messages.ts'

module.exports = (function() {
    // Open directory event
    ipcMain.on(OPEN_FILE_SELECTION.name, (ev, data) => {
        // Get property for file selection
        const fileSelectProperty = data.useFolders ? 'openDirectory' : 'openFile'

        // Open dialog for file selection (enable multi-selection mode)
        let promise = dialog.showOpenDialog({properties: [fileSelectProperty, 'multiSelections']})

        // Setup a promise to send the response
        promise.then(function(success) {
            if (!success.canceled) {
                // Get first file loaded
                // TODO: Multi-file support
                let file = success.filePaths[0]

                // Send reply to event for file loaded
                ev.reply(LOADED_FILE.name, LOADED_FILE.data(file))
            }
        }, function(error) {
            console.log(error)
        })
    })
})()

export {}