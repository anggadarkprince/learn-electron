// Modules to control application life and create native browser window
const {app, BrowserWindow, session, dialog, globalShortcut, Menu, MenuItem, Tray} = require('electron')

const windowStateKeeper = require('electron-window-state')

require('electron-reload')(__dirname)

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow
let childWindow

let mainMenu = new Menu()
let secMenu = Menu.buildFromTemplate(require('./mainMenu'))
let menuItem1 = new MenuItem({
    label: 'Electron',
    submenu: [
        {label: 'Item 1'},
        {label: 'Item 2'},
    ]
})
mainMenu.append(menuItem1)

let contextMenu = Menu.buildFromTemplate(require('./contextMenu'))

app.setBadgeCount(3);

let tray;
function createTray() {
    tray = new Tray('icon.png');
    tray.setToolTip('This is the App')

    const trayMenu = Menu.buildFromTemplate([
        {label: 'Tray menu item'},
        {role: 'quit'}
    ])

    tray.setContextMenu(trayMenu)
    tray.on('click', () => {
        mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show();
    })
}
function showDialog() {
    dialog.showOpenDialog({
        defaultPath: '/',
        buttonLabel: 'Select Item',
        properties: [
            "openFile", "multiSelections", "createDirectory"
        ]
    },
    (openPath) => {
        console.log(openPath)
    });

    let buttons = ['Yes', 'No', 'Maybe'];
    dialog.showMessageBox({
        buttons: buttons,
        title: 'Message Dialog',
        message: 'Are you an alien',
        detail: 'We really curious'
    },
        (buttonIndex) => {
            console.log(buttons[buttonIndex])
        })
}

function createWindow() {
    let appSession = session.fromPartition('persist:partition1');

    let winState = windowStateKeeper({
        defaultWidth: 1000,
        defaultHeight: 600
    })

    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: winState.width,
        height: winState.height,
        x: winState.x,
        y: winState.y,
        show: false,
        backgroundColor: '#ff0000',
        minWidth: 400,
        minHeight: 200,
        webPreferences: {
            session: appSession
        }
    })
    //childWindow = new BrowserWindow({width: 800, height: 400, parent: mainWindow, modal: true, frame: false})

    mainWindow.webContents.on('context-menu', (e) => {
        e.preventDefault()
        contextMenu.popup({})
    })
    winState.manage(mainWindow)

    let defaultSession = session.defaultSession
    let mainSession = mainWindow.webContents.session
    console.log(Object.is(mainSession, defaultSession))

    // and load the index.html of the app.
    mainWindow.loadFile('index.html')
    //childWindow.loadFile('child.html')

    let mainContents = mainWindow.webContents;

    mainContents.on('did-finish-load', () => {
        //mainWindow.loadURL('https://github.com')
    })
    console.log(mainContents);

    // wait until ready
    mainWindow.once('ready-to-show', () => {
        mainWindow.show()
    })

    // Or load a local HTML file
    // mainWindow.loadURL(`file://${__dirname}/app/index.html`)

    // Load a remote URL
    // mainWindow.loadURL('https://github.com')

    // Open the DevTools.
    // mainWindow.webContents.openDevTools()

    globalShortcut.register('CommandOrControl+o', () => {
        showDialog();
    })

    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null
    })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
    createWindow()
    Menu.setApplicationMenu(secMenu)
    createTray()
})

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', function () {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow()
    }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
