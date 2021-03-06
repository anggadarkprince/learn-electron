const {ipcRenderer} = require('electron')
const items = require('./item')
const menu = require('./menu.js')

$(document).keydown((e) => {
    switch (e.key) {
        case 'ArrowUp':
            items.changeItem('up')
            break;
        case 'ArrowDown':
            items.changeItem('down')
            break;
    }
})

$('.open-add-modal').click(() => {
    $('#add-modal').addClass('is-active')
})

$('.close-add-modal').click(() => {
    if (!$(this).is(':disabled')) {
        $('#add-modal').removeClass('is-active')
    }
})

$('#add-button').click(() => {
    let newItemUrl = $('#item-input').val()
    if (newItemUrl) {
        $('#item-input').prop('disabled', true)
        $('#add-button').addClass('is-loading')
        $('.close-add-modal').attr('disabled', true)
        ipcRenderer.send('new-item', newItemUrl)
    }
})

ipcRenderer.on('new-item-success', (e, item) => {
    items.toReadItems.push(item)

    items.saveItems()

    items.addItem(item)

    $('#add-modal').removeClass('is-active')
    $('#item-input').prop('disabled', false).val('http://')
    $('#add-button').removeClass('is-loading')
    $('.close-add-modal').attr('disabled', false)

    if(items.toReadItems.length === 1) {
        $('.read-item:first').addClass('is-active')
    }
})

$('#item-input').keyup((e) => {
    if (e.key == 'Enter') {
        $('#add-button').click();
    }
})

$('#search').keyup((e) => {
    let filter = $(e.currentTarget).val()
    $('.read-item').each((i, el) => {
        $(el).text().toLocaleLowerCase().includes(filter) ? $(el).show() : $(el).hide()
    })
})

if (items.toReadItems.length) {
    items.toReadItems.forEach(items.addItem)
    $('.read-item:first').addClass('is-active')
}