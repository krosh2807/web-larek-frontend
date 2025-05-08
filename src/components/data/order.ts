import { FormHandler } from '../data/form';
import { IOrderContact } from '../../types/index';
import { IEvents } from '../base/events';
import { ensureAllElements } from '../../utils/utils';

// Класс формы оформления заказа (доставка + оплата)
export class OrderForm extends FormHandler<IOrderContact> {
    protected paymentMethods: HTMLButtonElement[]; // Кнопки выбора способа оплаты

    constructor(
        formContainer: HTMLFormElement, 
        eventSystem: IEvents
    ) {
        // Инициализируем базовую логику формы
        super(formContainer, eventSystem);
        
        // Получаем все кнопки выбора оплаты
        this.paymentMethods = ensureAllElements<HTMLButtonElement>(
            '.button_alt',
            formContainer
        );
        
        // Назначаем обработчики событий на эти кнопки
        this.setupPaymentSelection();
    }

    // Назначает слушатели кликов по кнопкам оплаты
    private setupPaymentSelection(): void {
        this.paymentMethods.forEach(button => {
            button.addEventListener('click', () => {
                this.selectedPayment = button.name;                         // Устанавливаем выбранный метод
                this.eventSystem.emit('payment:changed', button);          // Генерируем событие смены оплаты
            });
        });
    }

    // Обновляет визуальное состояние кнопок оплаты
    set selectedPayment(methodName: string) {
        this.paymentMethods.forEach(button => {
            this.changeClassState(
                button,
                'button_alt-active',                   // Добавляет или удаляет CSS-класс активной кнопки
                button.name === methodName
            );
        });
    }

    // Устанавливает значение адреса доставки в поле формы
    set deliveryAddress(addressValue: string) {
        const addressField = this.formElement.elements.namedItem('address') as HTMLInputElement;
        addressField.value = addressValue;
    }
}
