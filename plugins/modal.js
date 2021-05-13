// Все элементы ниже это класс element, у этого класса можно обратиться к prototype и создать дополнительный
// метод appendAfter, а именно у ноды мы вызываем и говорим после какого элемента нам нужно вставить.
Element.prototype.appendAfter = function (element) {
    element.parentNode.insertBefore(this, element.nextSibling);
}

function noop() { }

function _createModalFooter(buttons = []) {
    if (buttons.length === 0) {
        return document.createElement('div')
    }
    const wrap = document.createElement('div')
    wrap.classList.add('modal-footer')

    buttons.forEach(btn => {
        const $btn = document.createElement('button')
        $btn.textContent = btn.text
        $btn.classList.add('btn')
        $btn.classList.add(`btn-${btn.type || 'secondary'}`)
        $btn.onclick = btn.handler || noop

        wrap.appendChild($btn)
    })

    return wrap
}

function _createModal(options) {
    const DEFAULT_WIDTH = '600px'
    const modal = document.createElement('div')
    modal.classList.add('vmodal')
    /* вставляем объект вырезанный из html */
    modal.insertAdjacentHTML('afterbegin', `
        <div class="modal-overlay" data-close="true">
            <div class="modal-window" style="width: ${options.width || DEFAULT_WIDTH}">
                <div class="modal-header">
                    <span class="modal-title"data-title>${options.title || 'Окно'}</span>
                    ${options.closable ? `<span class="modal-close" data-close="true">&times;</span>` : ''}
                </div>
                <div class="modal-body" data-content>
                    ${options.content || ''}
                </div>
            </div>
        </div>
    `)
    const footer = _createModalFooter(options.footerButtons)
    footer.appendAfter(modal.querySelector('[data-content]'))
    document.body.appendChild(modal)
    return modal
}



function _createCard(options) {
    const card = document.createElement('div')
    card.classList.add('row')
    card.innerHTML('afterbegin', `
        <div class="col">
            <div class="card">
                <img src="img/apple.jpg" class="card-img-top">
                <div class="card-body">
                    <h5 class="card-title">${sortingFruits}</h5>
                    <a href="#" class="btn btn-primary">Посмотреть цену</a>
                    <a href="#" class="btn btn-danger">Удалить</a>
                </div>
            </div>
        </div>
    `)
    document.body.appendChild(card)
    return card
}


//избавились от футера
/* <div class="modal-footer">
    <button>Ok</button>
    <button>Cancel</button>
</div> */

/*
* title: string +
* closable: boolean +
* content: string +
* width: string +
* destroy(): void +
* Окно должно закрываться +
* setContent(html: string): void | PUBLIC +
*-----------------------
* Реализовать методы ниже, для того чтобы были доступны как параметры.
*onClose(): void  возникает при закрытии формы +
*onOpen(): void  возникает при открытии формы
*beforeClose(): boolean  возникает перед закрытием
*-----------------------
animate.css +
*/
// ---------------------------------------------------------------------------------------------------
// Реализовать объект options, а именно
// title: string, для того чтобы вы передавали
// в модальное окно титле и чтобы он применялся для вставленного из хтмл элемента.
// closable: boolean и в том случае если это true то тогда данный крестик у нас показывается,
// если false данного крестика нет.
// content: string, значит какой то динамический контент который будет находится в теле вставленного из хтмл,
// то наполнение которое должно попадать в модальное окно.
// width: string, например ('400px'), этот параметр будет отвечать за ширину модального окна,который можно настраивать.
// destroy(): void реализовать метод, должен убирать из дом дерева модальное окно $modal=_createModal() и также
// удалять все слушатели, которые возможно у вас появятся, а они должны появится потому что это часть модального окна.
// этот метод должен полностью удалить модальное окно, чтобы не осталось каких либо элементов.
// При нажатии на крестик модальное окно должно закрываться и при нажатии на overlay тоже закрываться с анимацией.
// ------***сделать публичный метод, который будет доступен для opena(инстаса), он будет называться:
// setContent(html: string): void | PUBLIC и возвращать ничего, вызывая этот метод и передавая в него html динамически будет меняться
// содержимое модального окна.
// onClose(): void хук который вызывается когда модальное окно закрыто.
// onOpen(): void
// beforeClose(): boolean  true или false, если это true то модальное окно можно закрыть, если false модальное окно не закрывается.
// ------***animate.css библиотека
// -----------------------------------------------------------------------------------------------------



$.modal = function (options) {
    // КОЛИЧЕСТВО МИЛИСЕКУНД ЗА КОТОРОЕ ИДЕТ АНИМАЦИЯ
    const ANIMATION_SPEED = 200
    const $modal = _createModal(options)
    /* защита,чтобы во время вызова close не вызвать метода open */
    let closing = false
    let destroyed = false

    const modal = {
        open() {
            if (destroyed) {
                return console.log('Modal is destroyed')
            }
            /* если вдруг вызывается метод open, когда переменная closing находится
            в значении true, то тогда не нужно добавлять класс open  */
            /* и получается ! если не closing то тогда добавляем метод open*/
            !closing && $modal.classList.add('open')
        },
        close() {
            closing = true
            $modal.classList.remove('open')
            $modal.classList.add('hide')
            setTimeout(() => {
                /* пока идет удаление, добавляется класс hide */
                $modal.classList.remove('hide')
                /* как только таймаут проходит closing меняет значение */
                closing = false
                // спрашиваем - в наборе опций onClose присутствует и плюс его тип функция
                if (typeof options.onClose === 'function') {
                    options.onClose()
                }
            }, ANIMATION_SPEED)
            /* количество милисекунд, которое можно менять в константе */
        },


        // onClose() {
        // 	TCloseEvent = procedure (Sender: TObject;
        //   var Action: TCloseAction) of object;
        // }
        // onOpen(): void
        // beforeClose(): boolean
    }

    const listener = event => {
        if (event.target.dataset.close) {
            modal.close()
        }
    }

    $modal.addEventListener('click', listener)

    // $modal.addEventListener('click', event => {
    //     console.log('Clicked', event.target.dataset.close)
    //     if (event.target.dataset.close) {
    //         modal.close()
    //     }
    // })

    return Object.assign(modal, {
        destroy() {
            $modal.parentNode.removeChild($modal)
            $modal.removeEventListener('click', listener)
            destroyed = true
        },
        setContent(html) {
            $modal.querySelector('[data-content]').innerHTML = html
        },
        setTitle(html) {
            $modal.querySelector('[data-title]').innerHTML = html
        }
    })
}