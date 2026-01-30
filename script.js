let hamburger = document.querySelector('.js-hamburger');
hamburger.addEventListener('click', ()=> hamburger.classList.toggle('hamburger-is-active'));

class Modal {
    constructor(options = {}) {
        this.options = {
            title: options.title || 'Модальное окно',
            content: options.content || '',
            width: options.width || '500px',
            closable: options.closable !== false,
            onOpen: options.onOpen || (() => {}), // Вызывается при открытии
            onClose: options.onClose || (() => {}),
            ...options
        };
        
        this.handlerEsc = this.#handleEsc.bind(this);
        this.#render();
        this.#setupEvents();
    }

    #render() {
        this.$el = document.createElement('div');
        this.$el.classList.add('v-modal-overlay');
        this.$el.innerHTML = `
            <div class="v-modal-window" style="max-width: ${this.options.width}">
                <div class="v-modal-body">
                    ${this.options.content}
                </div>
            </div>
        `;
        document.body.appendChild(this.$el);
    }

    #setupEvents() {
        this.$el.addEventListener('click', (event) => {
            if (event.target.dataset.close || event.target === this.$el) {
                this.close();
            }
        });
    }

    #handleEsc(event) {
        if (event.key === 'Escape') this.close();
    }

    open() {
        document.addEventListener('keydown', this.handlerEsc);
        setTimeout(() => {
            this.$el.classList.add('open');
            // ВАЖНО: вызываем onOpen после добавления класса open
            this.options.onOpen(this); 
        }, 10);
    }

    close() {
        this.$el.classList.remove('open');
        document.removeEventListener('keydown', this.handlerEsc);
        this.options.onClose();
        setTimeout(() => this.destroy(), 300);
    }

    destroy() {
        this.$el.remove();
    }
}

function initProductSwiper(container) {
    
    let swiper = new Swiper(container.querySelector(".product-swiper"), {
        loop: true,
        navigation: {
            nextEl: container.querySelector(".product-slider-button-next"),
            prevEl: container.querySelector(".product-slider-button-prev"),
        },
        pagination: {
            el: container.querySelector(".swiper-pagination"),
            clickable: true
        },
        observer: true,
        observeParents: true,
    });
    console.log(container.querySelector(".product-swiper"));
    return swiper;
}

// Получение контента из шаблона
function getProductContent() {
    const template = document.getElementById('product-template');
    return template.content.cloneNode(true);
}

// --- ЛОГИКА BOTTOM SHEET ---
const bottomSheet = document.querySelector(".bottom-sheet");
const sheetContent = bottomSheet.querySelector(".content");
const sheetBody = bottomSheet.querySelector(".body");
const dragIcon = bottomSheet.querySelector(".drag-icon");

let isDragging = false, startY, startHeight;

const showBottomSheet = () => {
    // Очищаем и вставляем свежий контент
    sheetBody.innerHTML = '';
    const content = getProductContent();
    sheetBody.appendChild(content);
    
    bottomSheet.classList.add("show");
    document.body.style.overflow = "hidden";
    updateSheetHeight(90); // Открываем на половину

    // Инициализируем свайпер внутри
    initProductSwiper(sheetBody);
}

const hideBottomSheet = () => {
    bottomSheet.classList.remove("show");
    document.body.style.overflow = "";
}

const updateSheetHeight = (height) => {
    sheetContent.style.height = `${height}vh`;
    bottomSheet.classList.toggle("fullscreen", height > 90);
}

// Исправление: Тянем ТОЛЬКО за dragIcon, чтобы не конфликтовать со свайпером
const dragStart = (e) => {
    isDragging = true;
    startY = e.pageY || e.touches?.[0].pageY;
    startHeight = parseInt(sheetContent.style.height);
    bottomSheet.classList.add("dragging");
}

const dragging = (e) => {
    if (!isDragging) return;
    const currentY = e.pageY || e.touches?.[0].pageY;
    const delta = startY - currentY;
    const newHeight = startHeight + (delta / window.innerHeight) * 100;
    if (newHeight > 20 && newHeight < 96) {
        updateSheetHeight(newHeight);
    }
}

const dragStop = () => {
    if (!isDragging) return;
    isDragging = false;
    bottomSheet.classList.remove("dragging");
    const sheetHeight = parseInt(sheetContent.style.height);
    
    if (sheetHeight < 35) {
        hideBottomSheet();
    } else if (sheetHeight > 75) {
        updateSheetHeight(90);
    } else {
        updateSheetHeight(50);
    }
}

// Слушатели для Bottom Sheet (только за иконку)
dragIcon.addEventListener("mousedown", dragStart);
dragIcon.addEventListener("touchstart", dragStart);
document.addEventListener("mousemove", dragging);
document.addEventListener("touchmove", dragging);
document.addEventListener("mouseup", dragStop);
document.addEventListener("touchend", dragStop);
bottomSheet.querySelector(".sheet-overlay").addEventListener("click", hideBottomSheet);

// --- ГЛАВНЫЙ ОБРАБОТЧИК КЛИКА НА ТОВАР ---
document.querySelectorAll(".js-product-elem, .js-show-modal-product").forEach(btn => {
    btn.addEventListener('click', () => {
        if (window.innerWidth < 744) {
            showBottomSheet();
        } else {
            const modal = new Modal({
                width: '900px',
                content: '', // Сначала пусто
                onOpen(modalInstance) {
                    // Вставляем контент в модалку
                    const content = getProductContent();
                    const body = modalInstance.$el.querySelector('.v-modal-body');
                    body.innerHTML = '';
                    body.appendChild(content);
                    // Инициализируем свайпер
                    initProductSwiper(body);
                }
            });
            modal.open();
        }
    });
});