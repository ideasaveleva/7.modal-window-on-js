let fruits = [
    { id: 1, title: 'Яблоки', price: 20, img: 'img/apple.jpg' },
    { id: 2, title: 'Апельсины', price: 30, img: 'img/orange.jpg' },
    { id: 3, title: 'Манго', price: 40, img: 'img/mango.jpg' },
]

const toHtml = fruit => `
    <div class="col">
        <div class="card">
            <img src="${fruit.img}" class="card-img-top"alt="${fruit.title}">
            <div class="card-body">
                <h5 class="card-title">${fruit.title}</h5>
                <a href="#" class="btn btn-primary" data-btn="price" data-id="${fruit.id}">Посмотреть цену</a>
                <a href="#" class="btn btn-danger" data-btn="remove" data-id="${fruit.id}">Удалить</a>
            </div>
        </div>
    </div>
`
//из одной карточки по количеству в массиве
// const html = fruits.map(fruit => toHtml(fruit)) тоже что и в функции ниже
function render() {
    const html = fruits.map(toHtml).join('')
    document.querySelector('#fruits').innerHTML = html
}
render()

/**
 * 1. Динамически на основе массива вывести список карточек +
 * 2. Показать цену в модалке (и это должна быть одна модалка) +
 * 3. Модалка для удаления с 2мя кнопками +
 * -----------------
 * 4. На основе $.modal нужно сделать другой плагин $.confirm (Promise) +
 */


const priceModal = $.modal({
    title: 'Цена на товар',
    closable: true,
    width: '400px',
    footerButtons: [
        {
            text: 'Закрыть', type: 'primary', handler() {
                priceModal.close()
            }
        },
    ]
})

/* Как в этом обработчике понять какой именно фрукт нам удалить? можно сделать через колбеки, но это неправильно!
const confirmModal = $.modal({
    title: 'Вы уверены?',
    closable: true,
    width: '400px',
    footerButtons: [
        {
            text: 'Отменить', type: 'secondary', handler() {
                confirmModall.close()
            }
        },
        {
            text: 'Удалить', type: 'danger', handler() {
                confirmModal.close()
            }
        },
    ]
})
*/



//    {text: 'Chancel', type: 'danger', handler() {
//          priceModal.close()
//     }}



document.addEventListener('click', event => {
    // чтобы отменить добавление # в адресную строку
    event.preventDefault()
    //спрашиваем у event : eсли тот элемент по которому мы кликнули содержит атрибут data-btn
    const btnType = event.target.dataset.btn
    // если мы из строчки забираем величину, она является строчкой, а id это числа, поэтому перед event ставим +(преобразование к числу)
    const id = +event.target.dataset.id
    const fruit = fruits.find(f => f.id === id)

    if (btnType === 'price') {
        priceModal.setContent(`
            <p>Цена на ${fruit.title}: <strong>${fruit.price}$</strong></p>
        `)
        priceModal.open()
    } else if (btnType === 'remove') {
        $.confirm({
            title: 'Вы уверены?',
            content: `<p>Вы удаляете фрукт: <strong>${fruit.title}</strong></p>`
            // если попали в метод then, значит нажали удалить
        }).then(() => {
            fruits = fruits.filter(f => f.id !== id)
            // при удалении вышла ошибка, тк пропала строка, значит нужно вызвать метод render чтобы обновить отображение
            render()
            // если попали в метод catch, значит нажали Cancel
        }).catch(() => {
            console.log('Cancel');
        })
        // confirmModal.setContent(`
        //     <p>Вы удаляете фрукт: <strong>${fruit.title}</strong></p>
        // `)
        // confirmModal.open()
    }
})

