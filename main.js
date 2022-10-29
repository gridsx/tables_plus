const { app, BrowserWindow, ipcMain } = require('electron')


// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
require('child_process').spawn('./crane.exe')

let win

function createWindow() {


  // Create the browser window.
  win = new BrowserWindow({
    width: 1280,
    minWidth:1200,
    height: 720,
    minHeight: 600,
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
      contextIsolation: false,
    }
  })

  win.loadURL('http://localhost:9999/')

  // win.webContents.openDevTools({ mode: 'bottom' });

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null
  })

  ipcMain.handle('win', async (event, action) => {
    if (action === 'min') {
      win.minimize();
    } else if (action === 'max') {
      win.maximize();
    } else if (action === 'close') {
      app.quit()
    } else if (action === 'dev') {
      win.webContents.openDevTools({ mode: 'bottom' });
    }
    return 'done'
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.


