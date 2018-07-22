module.exports = [
    {
        label: 'Electron',
        submenu: [
            {
                label: 'Greet',
                click: () => {
                    console.log('Hello from menu')
                },
                accelerator: 'Shift+Alt+G'
            },
            {
                label: 'Text',
                submenu: [
                    {label: 'Copy', enabled: false},
                    {label: 'Cut'},
                    {label: 'Delete'},
                ]
            },
        ]
    },
    {
        label: 'Action',
        submenu: [
            {label: 'Item 1'},
            {label: 'Item 2'},
            {label: 'Item 3'},
            {
                label: 'Toggle developer tools',
                role: 'toggledevtools'
            },
            {
                role: 'togglefullscreen'
            }
        ]
    },
    {
        label: 'Edit',
        submenu: [
            {role: 'undo'},
            {role: 'redo'},
            {role: 'copy'},
            {role: 'paste'},
        ]
    }
]