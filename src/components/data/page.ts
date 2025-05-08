import { UiComponent } from '../base/component';
import { IEvents } from '../base/events';
import { ensureElement } from '../../utils/utils';

// Интерфейс данных страницы: количество товаров и список DOM-элементов галереи
interface IPageData {
    itemsCount: number;
    galleryItems: HTMLElement[];
}

// Класс AppPage управляет визуальной частью страницы (корзина, галерея, прокрутка и т.д.)
export class AppPage extends UiComponent<IPageData> {
    protected basketCounter: HTMLElement;      // Элемент с числом товаров в корзине
    protected itemsGallery: HTMLElement;       // Контейнер галереи товаров
    protected pageWrapper: HTMLElement;        // Обёртка страницы для блокировки прокрутки
    protected basketButton: HTMLElement;       // Кнопка открытия корзины

    constructor(
        container: HTMLElement, 
        protected eventSystem: IEvents         // Система событий (шина)
    ) {
        super(container);

        // Инициализация элементов DOM
        this.basketCounter = ensureElement<HTMLElement>('.header__basket-counter');
        this.itemsGallery = ensureElement<HTMLElement>('.gallery');
        this.pageWrapper = ensureElement<HTMLElement>('.page__wrapper');
        this.basketButton = ensureElement<HTMLElement>('.header__basket');

        // Обработка клика по кнопке корзины
        this.initializeBasketButton();
    }

    // Навешивает обработчик на кнопку корзины
    private initializeBasketButton(): void {
        this.basketButton.addEventListener('click', () => {
            this.eventSystem.emit('basket:opened'); // Генерирует событие открытия корзины
        });
    }

    // Устанавливает количество товаров в корзине
    set basketItemsCount(count: number) {
        this.updateTextContent(this.basketCounter, String(count));
    }

    // Обновляет содержимое галереи
    set galleryContent(items: HTMLElement[]) {
        this.itemsGallery.replaceChildren(...items);
    }

    // Блокирует или разблокирует прокрутку страницы (например, при открытии модального окна)
    set scrollLocked(isLocked: boolean) {
        this.changeClassState(
            this.pageWrapper,
            'page__wrapper_locked',
            isLocked
        );
    }
}
