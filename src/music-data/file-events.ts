const { ipcMain, dialog } = require('electron')
const { LOADED_FILE, OPEN_FILE_SELECTION } = require('@common/messages.ts')

module.exports = (function() {
    // Open directory event
    // TODO: Modularize message
    ipcMain.on(OPEN_FILE_SELECTION.name, (ev, data) => {
        console.log(data)

        // TODO: Move this elsewhere?
        var propertyDict = {
            false: 'openFile',
            true: 'openDirectory'
        }

        // Get property for file selection
        const property = propertyDict[data.useFolders]

        // Open dialog for file selection (enable multi-selection mode)
        let promise = dialog.showOpenDialog({properties: [property, 'multiSelections']})

        // Setup a promise to send the response
        promise.then(function(success) {
            if (!success.canceled) {
                // Get first file loaded
                // TODO: Multi-file support
                let file = success.filePaths[0]

                // Send reply to event for file loaded
                // TODO: Modularize mssage
                ev.reply(LOADED_FILE.name, LOADED_FILE.data(file))
            }
        }, function(error) {
            console.log(error)
        })
    })
})()

export {}