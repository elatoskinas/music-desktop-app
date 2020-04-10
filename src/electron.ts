// Module requires
import { app, BrowserWindow, globalShortcut } from 'electron'

// Event imports (adds new events to app.on)
import '@music-data/file-events.ts'

function createWindow() {
    // Create the browser window.
    let win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        }
    })

    // Load index.html of the app
    win.loadFile('index.html')

    // Open DevTools
    //win.webContents.openDevTools()

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