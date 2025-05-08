import { FormHandler } from '../data/form';
import { IOrderForm } from '../../types/index';
import { IEvents } from '../base/events';

//Форма ввода контактных данных
export class ContactDetailsForm extends FormHandler<IOrderForm> {
    constructor(
        protected override formElement: HTMLFormElement,
        protected eventDispatcher: IEvents
    ) {
        super(formElement, eventDispatcher);
    }

    set customerPhone(phoneNumber: string) {
        this.setInputValue('phone', phoneNumber);
    }

    set customerEmail(emailAddress: string) {
        this.setInputValue('email', emailAddress);
    }

    get formValues(): { phone: string; email: string } {
        return {
            phone: this.getInputValue('phone'),
            email: this.getInputValue('email')
        };
    }
    //Записывает значение в поле формы по имени
    private setInputValue(name: string, value: string): void {
        const input = this.formElement.elements.namedItem(name) as HTMLInputElement;
        if (input) {
            input.value = value;
        }
    }
    //Получает значение из поля формы по имени
    private getInputValue(name: string): string {
        const input = this.formElement.elements.namedItem(name) as HTMLInputElement;
        return input?.value ?? '';
    }
}