import { app, BrowserWindow, globalShortcut, ipcMain, dialog } from 'electron'
import path from 'path'

import ApplicationDB from '@backend/app-database'

import { GET_SONGS, LOADED_SOUND, OPEN_FILE_SELECTION, RETURN_SONGS } from '@common/messages.ts'
import * as fileLoader from '@backend/file-loader'
import { SUPPORTED_TYPES } from '@common/status.ts'

// Event imports (adds new events to app.on)
import { Song } from '@data/music-data'

function createWindow() {
    // Create the browser window.
    let win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,

            // Disable web security to allow typical production functionality,
            // e.g. reading files from file system
            webSecurity: !(process.env.NODE_ENV === 'development'),
        },
    })

    if (process.env.NODE_ENV === 'development') {
        // TODO: configure port to always be 8080 in config
        // TODO: Should export port as constant?
        win.loadURL('http://localhost:8080')
    } else {
        win.loadFile(path.join(__dirname, 'index.html'))
    }

    // Open DevTools
    win.webContents.openDevTools()

    // Hide menu bar
    win.setMenuBarVisibility(false)
}

// The method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(createWindow)

// Quit when all windows are closed
app.on('window-all-closed', () => {
    // On MacOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    // On MacOS it's common to recreate a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
})

app.on('ready', async () => {
    // Ignore refresh
    globalShortcut.register('CmdOrCtrl+R', () => {})
})

// Open directory event
ipcMain.on(OPEN_FILE_SELECTION.name, (ev, data) => {
    // Get property for file selection
    const fileSelectProperty = data.useFolders ? 'openDirectory' : 'openFile'

    // Open dialog for file selection (enable multi-selection mode)
    let promise = dialog.showOpenDialog({
        properties: [fileSelectProperty, 'multiSelections'],
        filters: [{ name: 'All Files', extensions: SUPPORTED_TYPES }],
    })

    // Setup a promise to send the response
    promise.then(
        function (success) {
            // If file selection was not cancelled, then process selected file paths
            if (!success.canceled) {
                // Construct file callback to send back to event
                let replyCallback = function fileSendCallback(sound: Song) {
                    ApplicationDB.addSong(sound)
                    ev.reply(LOADED_SOUND.name, LOADED_SOUND.data(sound))
                }

                fileLoader.processSoundFilePaths(
                    success.filePaths,
                    replyCallback
                )
            }
        },
        function (error) {
            console.log(error)
        }
    )
})

ipcMain.on(GET_SONGS.name, (ev, data) => {
    const songs = ApplicationDB.getSongs()
    ev.reply(RETURN_SONGS.name, RETURN_SONGS.data(songs))
})
