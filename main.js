const {app, BrowserWindow, ipcMain} = require('electron')
const path = require('path');
// 日志重定向至文件
// const fs = require("fs");
// const logFile = fs.createWriteStream("/Users/kyleyu/dbv.logs", {flags: "a"});
// console.log = (msg) => logFile.write(msg.toString())
// console.error = (msg) => logFile.write(msg.toString())
// console.log('ready to start crane')
let craneProcess;
if (process.platform === 'darwin') {
  const cranePath = path.join(process.resourcesPath, 'bin', 'crane');
  // console.log('cranePath:' + cranePath + '\n')
  // macOS App都应该遵照
  // https://stackoverflow.com/questions/54456961/where-to-store-preferences-log-files-caches-on-mac-os-x-for-java-apps
  // console.log('logpath:' + app.getPath('logs') + '\n')
  // console.log('datapath:' + app.getPath('userData') + '\n')
  craneProcess = require('child_process').spawn(cranePath, ['--logpath', app.getPath('logs'), '--datapath', app.getPath('appData')])
  // console.log('stderr:')
  // console.log(craneProcess.stderr.toString('utf8'))
  // console.log('\nstdout:')
  // console.log(craneProcess.stdout.toString('utf8'))
  // console.log('\ncrane pid:' + craneProcess.pid + '\n')
} else {
  craneProcess = require('child_process').spawn('./crane.exe')
}
let win

function createWindow() {


  // Create the browser window.
  win = new BrowserWindow({
    width: 1280,
    minWidth: 1200,
    height: 720,
    minHeight: 600,
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
      contextIsolation: false,
    }
  })

  // todo 如何确保后台应用此时已经可以提供服务？
  win.loadURL('http://localhost:9999/')

  // win.webContents.openDevTools({ mode: 'bottom' });

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null
    ipcMain.removeHandler('win')
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

app.on('before-quit', () => {
  if (craneProcess) {
    craneProcess.kill()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.


