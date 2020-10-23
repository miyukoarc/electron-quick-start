// 2020-09-24 11:44

'use strict'

const dayjs = require('dayjs')

const {outputFile} = require('fs-extra')
const fs = require('fs')
const http = require('http')

const {
    app,
    protocol,
    BrowserWindow,
    BrowserView,
    Tray,
    Menu,
    ipcMain,
    dialog
} = require('electron')
// const {
//   default: installExtension,
//   VUEJS_DEVTOOLS
// } = require('electron-devtools-installer');
// const {createProtocol} = require('vue-cli-plugin-electron-builder/lib')
// import {
//   createProtocol,
//   /* installVueDevtools */
// } from 'vue-cli-plugin-electron-builder/lib'


const isDevelopment = process.env.NODE_ENV !== 'production'
const path = require('path')
const os = require('os')
const edge = require('electron-edge-js')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

console.log(edge)


// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([{
    scheme: 'app',
    privileges: {
        secure: true,
        standard: true
    }
}])

function createWindow() {
    // Create the browser window.
    win = new BrowserWindow({
        frame: false, //无边框窗口
        width: 800,
        height: 600,
        minHeight: 600,
        minWidth: 800,
        // maximizable: false,
        // transparent: true, 
        show: false,

        webPreferences: {
            devTools: true,
            sanbox: true, //微信扫码登录
            nodeIntegration: true,
            preload:
                // path.resolve('./src/preload.js')
                path.join(__dirname, 'preload.js')
        }
    })




    //   if (process.env.WEBPACK_DEV_SERVER_URL) {
    //     // Load the url of the dev server if in development mode
    //     win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    //     if (!process.env.IS_TEST) win.webContents.openDevTools()

    //   } else {
    //     // createProtocol('app')
    //     // Load the index.html when not in development
    //     win.loadURL('app://./index.html') //electron-builder
    //     // win.loadURL('./dist/index.html')

    //   }
    // win.loadFile('./dist/index.html')
    win.loadURL('http://nb.lihengguang.cn')


    // win.webContents.on('will-navigate', (event, url) => {
    //     // event.preventDefault()
    //     //   if(url.match('sidebar.cysrcrm.com')){
    //     const str = JSON.stringify(url)
    //     win.webContents.send('login-navigate', str)
    //     //   }

    //   })

    //   let loginFlag = false

    //   win.webContents.on('will-redirect', (event, url) => {
    //     //   event.preventDefault()
    //       if(url==='http://sidebar.cyscrm.com/'&&!loginFlag){

    //           const str = JSON.stringify(url)
    //           win.webContents.send('login-redirect', str)

    //           win.loadURL('http://localhost/#/')
    //           loginFlag = true
    //       }

    //       console.log(loginFlag)
    //   })


    win.on('ready-to-show', () => {
        win.show()
    })
    win.on('closed', (event, args) => {
        win = null
        // win.hide(); 
        // win.setSkipTaskbar(true);
        event.preventDefault();
    })

    win.on('maximize', (event, args) => {

        win.webContents.send('maximizeWindow', true)
    })

    win.on('unmaximize', (event, args) => {
        win.webContents.send('unmaximizeWindow', false)
    })


}

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
    // console.log(BrowserWindow.addDevToolsExtension)
    // BrowserWindow.addDevToolsExtension(
    //   path.join(os.homedir(), '/Microsoft/Edge/User Data/Default/Extensions/nhdogjmejiglipccpnnnanhbledajbpd')
    // )
})

/***
 * 
 */




// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
    if (isDevelopment && !process.env.IS_TEST) {
        // Install Vue Devtools
        // Devtools extensions are broken in Electron 6.0.0 and greater
        // See https://github.com/nklayman/vue-cli-plugin-electron-builder/issues/378 for more info
        // Electron will not launch with Devtools extensions installed on Windows 10 with dark mode
        // If you are not using Windows 10 dark mode, you may uncomment these lines
        // In addition, if the linked issue is closed, you can upgrade electron and uncomment these lines
        // try {
        //   await installVueDevtools()
        // } catch (e) {
        //   console.error('Vue Devtools failed to install:', e.toString())
        // }


    }
    createWindow()



})

app.whenReady().then(() => {

    // installExtension(VUEJS_DEVTOOLS)
    //     .then((name) => console.log(`Added Extension:  ${name}`))
    //     .catch((err) => console.log('An error occurred: ', err));
});

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
    if (process.platform === 'win32') {
        process.on('message', data => {
            if (data === 'graceful-exit') {
                app.quit()
            }
        })
    } else {
        process.on('SIGTERM', () => {
            app.quit()
        })
    }
}

ipcMain.on('minimizeWindow', e => {
    win.minimize()
})

ipcMain.on('maximizeWindow', e => {
    win.maximize()
})

ipcMain.on('restoreWindow', e => {
    win.restore()
})

ipcMain.on('closeWindow', e => {
    win.close()
})

ipcMain.on('qrcode-window', (event, args) => {
    let newWin = new BrowserWindow({
        width: 480,
        height: 480,
        frame: true,
        webPreferences: {
            nodeIntegration: true
        }
    })

    Promise.resolve(newWin).then(() => {
        newWin.loadURL(`http://localhost/#/qrcode?tenantId=${args}`)
    }).then(() => {

        newWin.on('close', () => { newWin = null })
        newWin.show()

    })
    newWin.webContents.on('will-navigate', (event, url) => {
    })

})


// 2020-07-17，汪轩昂新增1
ipcMain.on('openChat', (event, arg) => {
    process.env.EDGE_USE_CORECLR = 1;
    var basePath = process.cwd();
    var baseDll = basePath + '/resources/app/lib/ClassLibraryChaoying.dll';

    const openChat = edge.func({
        assemblyFile: baseDll,
        typeName: 'ClassLibraryChaoying.WorkWx',
        methodName: 'OpenChat'
    });

    openChat(arg, (err, res) => {
        event.reply("reply-openChat", { err, res, val: arg })
        // event.returnValue = { err, res, val: arg }
    })
})

// 2020-07-17，汪轩昂新增2
ipcMain.on('inputEnter', (event, arg) => {
    process.env.EDGE_USE_CORECLR = 1;
    var basePath = process.cwd();
    var baseDll = basePath + '/resources/app/lib/ClassLibraryChaoying.dll';

    const inputEnter = edge.func({
        assemblyFile: baseDll,
        typeName: 'ClassLibraryChaoying.WorkWx',
        methodName: 'InputEnter'
    });
    console.log('调用了inputEnter')
    inputEnter(arg, (err, res) => {
        event.reply("reply-inputEnter", { err, res, val: arg })
    })
})

// 2020-07-17，汪轩昂新增3
ipcMain.on('AddCustomerByMobiles', (event, arg) => {
    process.env.EDGE_USE_CORECLR = 1;
    var basePath = process.cwd();
    var baseDll = basePath + '/resources/app/lib/ClassLibraryChaoying.dll';

    const AddCustomerByMobiles = edge.func({
        assemblyFile: baseDll,
        typeName: 'ClassLibraryChaoying.WorkWx',
        methodName: 'AddCustomerByMobiles'
    });

    AddCustomerByMobiles(arg, (err, res) => {
        event.reply("reply-AddCustomerByMobiles", { err, res, val: arg })
    })
})


// 2020-08-21，汪轩昂新增4
ipcMain.on('LockScreen', (event, arg) => {
    process.env.EDGE_USE_CORECLR = 1;
    var basePath = process.cwd();
    var baseDll = basePath + '/resources/app/lib/ClassLibraryChaoying.dll';

    const Open = edge.func({
        assemblyFile: baseDll,
        typeName: 'ClassLibraryChaoying.LockScreen',
        methodName: 'Open'
    });

    Open(arg, (err, res) => {
        event.reply("reply-LockScreen", { err, res, val: arg })
    })
})

// 2020-08-21，汪轩昂新增5
ipcMain.on('UnlockScreen', (event, arg) => {
    process.env.EDGE_USE_CORECLR = 1;
    var basePath = process.cwd();
    var baseDll = basePath + '/resources/app/lib/ClassLibraryChaoying.dll';

    const CLose = edge.func({
        assemblyFile: baseDll,
        typeName: 'ClassLibraryChaoying.LockScreen',
        methodName: 'CLose'
    });

    CLose(arg, (err, res) => {
        event.reply("reply-UnlockScreen", { err, res, val: arg })
    })
})

// 2020-08-22，汪轩昂新增6
ipcMain.on('IsLock', (event, arg) => {
    process.env.EDGE_USE_CORECLR = 1;
    var basePath = process.cwd();
    var baseDll = basePath + '/resources/app/lib/ClassLibraryChaoying.dll';

    const IsLock = edge.func({
        assemblyFile: baseDll,
        typeName: 'ClassLibraryChaoying.LockScreen',
        methodName: 'IsLock'
    });

    IsLock(arg, (err, res) => {
        event.reply("reply-IsLock", { err, res, val: arg })
    })
})



/**
 * 导出
 */



//!保存聊天存档
ipcMain.on('SAVE_STREAM', (event, filename, url) => {
    const file = fs.createWriteStream(filename)
  
    http.get(url, res => {
      res.pipe(file)
  
      res.once('end', () => {
        console.log('main success')
        event.sender.send('download-stream-success')

      })
  
      res.once('error', () => {
        event.sender.send('download-stream-failed')

      })
  
    })
  })
  
  //!保存上传文件（media）
  ipcMain.on('SAVE_UPLOAD_FILE', (event, filename, url) => {
      console.log(filename,url)
    const file = fs.createWriteStream(filename)
  
    http.get(url, res => {
      res.pipe(file)
      res.once('end', () => {
        event.sender.send('download-file-success')
  
      })
      res.once('error', () => {
        event.sender.send('download-file-failed')
  
      })
    })
  })
  
  //下载文件保存
  ipcMain.on('SAVE_FILE', (event, path, buffer) => {
  
    outputFile(path, buffer, err => {
      if (err) {
        // event.sender.send(ERROR, err.message)
        //   event.sender.send('SAVED_FILE', err.message)
        console.log('save failed')
      } else {
        //   event.sender.send('SAVED_FILE', path)
        console.log('save success')
        // event.sender.send()
      }
    })
  })
  
  //打开文件选择框
  ipcMain.on('open-directory-dialog', (event, payload) => {
    let date = dayjs(new Date()).format('YYYY-MM-DD_hh-mm-ss')
    dialog.showSaveDialog({
      defaultPath: `${payload}${date}.xls`,
    }).then(res => {
      console.log(res.filePath)
      let payload = {}
      if (res.canceled) {
        payload = {
          status: false
        }
      } else {
        payload = {
          status: true,
          filePath: res.filePath
        }
      }
      event.sender.send('selectedDirectory', payload)
    })
  })
  
  //!路径选择框 会话存档
  ipcMain.on('open-directory-dialog-message', (event, payload) => {
    let date = dayjs(new Date()).format('YYYY-MM-DD_hh-mm-ss')
    dialog.showSaveDialog({
      defaultPath: `${date}${payload}.zip`,
    }).then(res => {
      console.log(res.filePath)
      let payload = {}
      if (res.canceled) {
        payload = {
          status: false
        }
      } else {
        payload = {
          status: true,
          filePath: res.filePath
        }
      }
      event.sender.send('selected-directory-message', payload)
    })
  })
  
  //!路径选择框 上传文件
  ipcMain.on('open-directory-dialog-file', (event, filename) => {
    dialog.showSaveDialog({
      defaultPath: `${filename}`
    }).then(res => {
      let payload = {}
      if (res.canceled) {
        payload = {
          status: false
        }
      } else {
        payload = {
          status: true,
          filePath: res.filePath
        }
      }
  
      event.sender.send('selected-directory-file', payload)
    })
  })
  