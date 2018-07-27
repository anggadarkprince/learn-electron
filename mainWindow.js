const {BrowserWindow} = require('electron')

exports.win

exports.createWindow = () => {
    this.win = new BrowserWindow({
        width: 500,
        height: 650,
        minWidth: 350,
        maxWidth: 650,
        minHeight: 310,
        icon: `${__dirname}/icons/64x64.png`
    })

    //this.win.webContents.openDevTools();

    this.win.loadFile('./renderer/main.html')

    this.win.on('closed', () => {
        this.win = null
    })
}