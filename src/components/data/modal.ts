import { UiComponent } from '../base/component';
import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/events';

//Интерфейс структуры модального окна
interface IPopupContent {
    content: HTMLElement;
}

//Модальное окно попапа
export class Popup extends UiComponent<IPopupContent> {
    protected closeButton: HTMLButtonElement;
    protected contentContainer: HTMLElement;

    constructor(
        protected container: HTMLElement,
        protected events: IEvents
    ) {
        super(container);
        // Инициализируем элементы управления внутри модалки.
        this.closeButton = ensureElement<HTMLButtonElement>('.modal__close', container);
        this.contentContainer = ensureElement<HTMLElement>('.modal__content', container);

        this.setupEventListeners();
    }
    //Обработчики кликов
    private setupEventListeners(): void {
        this.closeButton.addEventListener('click', () => this.close());
        this.container.addEventListener('click', (e) => {
            if (e.target === this.container) this.close();
        });
        this.contentContainer.addEventListener('click', (e) => e.stopPropagation());
    }
    // Открывает модальное окно и вызывает событие 'modal:open'.
    open(): void {
        this.container.classList.add('modal_active');
        this.events.emit('modal:open');
    }
    // Закрывает модальное окно и вызывает событие 'modal:close'.
    close(): void {
        this.container.classList.remove('modal_active');
        this.events.emit('modal:close');
    }
    //Новый компонент в модальноем окне
    set content(content: HTMLElement) {
        this.contentContainer.replaceChildren(content);
    }
}