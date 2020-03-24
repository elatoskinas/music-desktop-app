const { ipcMain, dialog } = require('electron')

module.exports = (function() {
    // Open directory event
    // TODO: Modularize message
    ipcMain.on('openFileSelection', (ev, data) => {
        // TODO: Move this elsewhere?
        var propertyDict = {
            false: 'openFile',
            true: 'openDirectory'
        }

        // Get property for file selection
        const property = propertyDict[data.folders]

        // Open dialog for file selection (enable multi-selection mode)
        let promise = dialog.showOpenDialog({properties: [property, 'multiSelections']})

        // Setup a promise to send the response
        promise.then(function(success) {
            // Get first file loaded
            // TODO: Multi-file support
            let file = success.filePaths[0]

            // Send reply to event for file loaded
            // TODO: Modularize mssage
            ev.reply('loadedFile', file)
        }, function(error) {
            console.log(error)
        })
    })
})()

export {};