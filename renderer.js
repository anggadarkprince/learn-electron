// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const {ipcRenderer, remote} = require('electron');

remote.dialog.showMessageBox({
    message: 'A message invoked',
    buttons: ['OK']
})

ipcRenderer.send('channel1', 'Hello from the renderer process');

ipcRenderer.on('channel1', (e, args) => {
    console.log(args)
})

ipcRenderer.on('channel2', (e, args) => {
    console.log(args)
})

ipcRenderer.on('private', (e, args) => {
    console.log(args)
})
