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

// 1. Подготовим HTML разметку для слайдера
const swiperHTML = `
    <div class="product-modal">
        <div class="product-slider">
            <div class="swiper mySwiper">
            <div class="swiper-wrapper">
                <div class="swiper-slide">
                    <img src="./media/products/product-1.png" />
                </div>
                <div class="swiper-slide">
                    <img src="./media/products/product-2.png" />
                </div>
                <div class="swiper-slide">
                    <img src="./media/products/product-3.png" />
                </div>
            </div>
            <div class="product-slider-button-next"><img src="media/arrow-slider.svg"/></div>
            <div class="product-slider-button-prev"><img src="media/arrow-slider.svg"/></div>
            <div class="swiper-pagination"></div>
            </div>
        </div>
        <div class="product-options">
            <div class="priduct-modal-name">Футблока 10 RUB</div>
            <div class="product-option product-option-size">
                <span class="option-title">Размер</span>
                <span class="option-items">
                    <span class="size-item">
                        <span class="size-name">XS</span>
                        <span class="size-num">12</span>
                    </span>
                    <span class="size-item">
                        <span class="size-name">S</span>
                        <span class="size-num">12</span>
                    </span>
                    <span class="size-item disabled-size-item">
                        <span class="size-name">M</span>
                        <span class="size-num">0</span>
                    </span>
                    <span class="size-item">
                        <span class="size-name">L</span>
                        <span class="size-num">12</span>
                    </span>
                </span>
            </div>
            <div class="product-option product-option-color">
                <span class="option-title">Цвет</span>
                <span class="option-items">
                    <span class="color-item color-item-active"><span style="background: #fff"></span></span>
                    <span class="color-item"><span style="background: #000"></span></span>
                </span>
            </div>
            <div class="product-option product-option-controls">
                <span class="product-modal-price">5 990 ₽</span>
                <button class="add-to-cart">
                    Добавить в корзину  
                    <img src="media/white_plus.svg" alt="">
                </button>
            </div>
        </div>
    </div>
`;

document.querySelectorAll(".js-product-elem").forEach(productElem=>{
    productElem.addEventListener('click', ()=>{
        if (window.innerWidth < 744) {
            return;
        }
        const productModal = new Modal({
            title: 'Галерея в модальном окне',
            width: 'auto',
            content: swiperHTML,
            onOpen(modal) {
                // Инициализируем Swiper только когда модалка открыта
                // Используем поиск внутри элемента модалки modal.$el
                const swiper = new Swiper(modal.$el.querySelector(".mySwiper"), {
                    loop: true,
                    navigation: {
                        nextEl: ".product-slider-button-next",
                        prevEl: ".product-slider-button-prev",
                    },
                    pagination: {
                        el: ".swiper-pagination",
                    },
                    // Добавляем эти параметры для корректной работы в скрытых блоках
                    observer: true, 
                    observeParents: true,
                });
            }
        });
        productModal.open();
    });
});