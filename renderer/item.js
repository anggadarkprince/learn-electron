exports.toReadItems = JSON.parse(localStorage.getItem('toReadItems')) || []

exports.saveItems = () => {
    localStorage.setItem('toReadItems', JSON.stringify(this.toReadItems))
}

exports.selectItem = (e) => {
    $('.read-item').removeClass('is-active')
    $(e.currentTarget).addClass('is-active')
}

exports.changeItem = (direction) => {
    let activeItem = $('.read-item.is-active')

    let newItem = (direction === 'down') ? activeItem.next('.read-item') : activeItem.prev('.read-item')

    if (newItem.length) {
        activeItem.removeClass('is-active')
        newItem.addClass('is-active')
    }
}

window.deleteItem = (i = false) => {

    // Set i to active item if not passed as argument
    if (i === false) i = ($('.read-item.is-active').index() - 1)

    // Remove item from DOM
    $('.read-item').eq(i).remove()

    // Remove from toReadItems array
    this.toReadItems = this.toReadItems.filter((item, index) => {
        return index !== i
    })

    // Update storage
    this.saveItems()

    // Select prev item or none if list empty
    if (this.toReadItems.length) {

        // If first item was deleted, select new first item in list, else previous item
        let newIndex = (i === 0) ? 0 : i - 1

        // Assign active class to new index
        $('.read-item').eq(newIndex).addClass('is-active')

        // Else show 'no items' message
    } else {
        $('#no-items').show()
    }
}

window.openInBrowser = () => {

    // Only if items exists
    if (!this.toReadItems.length) return

    // Get selected item
    let targetItem = $('.read-item.is-active')

    // Open in Browser
    require('electron').shell.openExternal(targetItem.data('url'))
}

window.openItem = () => {
    if (!this.toReadItems.length) return

    let targetItem = $('.read-item.is-active')

    let contentURL = encodeURIComponent(targetItem.data('url'))
    let itemIndex = targetItem.index() - 1

    let readerWinURL = `file://${__dirname}/reader.html?url=${contentURL}&itemIndex=${itemIndex}`

    let renderWin = window.open(readerWinURL, targetItem.data('title'))
}

exports.addItem = (item) => {
    $('#no-items').hide()

    let itemHTML = `<a class="panel-block read-item" data-url="${item.url}" data-title="${item.title}">
                        <figure class="image has-shadow is-64x64 thumb" style="margin-top: 20px">
                            <img src="${item.screenshot}">
                        </figure>
                        <h2 class="title is-6 column">${item.title}</h2>
                    </a>`
    $('#read-list').append(itemHTML)

    $('.read-item').off('click, dblclick')
        .on('click', this.selectItem)
        .on('dblclick', this.openItem)
}