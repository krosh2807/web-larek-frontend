import { UiComponent } from '../base/component';
import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/events';

// Интерфейс для структуры
interface ICartView {
    items: HTMLElement[];
    total: number;
}

// Отображение и поведение корзины
export class Cart extends UiComponent<ICartView> {
    protected itemsList: HTMLElement;
    protected totalPrice: HTMLElement;
    protected checkoutBtn: HTMLButtonElement;
    protected container: HTMLElement;

    constructor(
        container: HTMLElement,
        protected events: IEvents
    ) {
        super(container);
        this.container = container;
        this.itemsList = ensureElement<HTMLElement>('.basket__list', container);
        this.totalPrice = ensureElement<HTMLElement>('.basket__price', container);
        this.checkoutBtn = ensureElement<HTMLButtonElement>('.basket__button', container);

        this.checkoutBtn.addEventListener('click', () => {
            events.emit('order:open');
        });
    }

    // Обновление товаров в корзине
    set setItems(items: HTMLElement[]) {
        this.itemsList.replaceChildren(...items);
    }

    // Подсчет общей суммы
    set updateTotal(total: number) {
        this.updateTextContent(this.totalPrice, `${total} синапсов`);
    }

    // Отключение или включение кнопки оформления заказа
    set selectedItems(items: ICartView['items']) {
        this.changeDisabledState(this.checkoutBtn, items.length === 0);
    }

    // Метод для активации/деактивации кнопки оформления заказа
    public changeDisabledState(button: HTMLButtonElement, disabled: boolean): void {
        button.disabled = disabled;
    }

    // Корневой элемент корзины
    render(): HTMLElement {
        return this.container;
    }
}
