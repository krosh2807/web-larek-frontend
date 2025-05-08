import { UiComponent } from '../base/component';
import { IEvents } from '../base/events';
import { ensureElement } from '../../utils/utils';

// Интерфейс описывает статус формы: валидна ли она и список ошибок
interface IFormStatus {
    isValid: boolean;
    errorMessages: string[];
}

// Обобщённый класс-обработчик формы
export class FormHandler<T> extends UiComponent<IFormStatus> {
    protected submitButton: HTMLButtonElement;   // Кнопка отправки формы
    protected errorContainer: HTMLElement;       // Контейнер для сообщений об ошибках

    constructor(
        protected formElement: HTMLFormElement,  // HTML-форма, с которой работает компонент
        protected eventSystem: IEvents           // Система событий
    ) {
        super(formElement); // Передаём форму как корневой DOM-элемент базовому классу

        // Находим элементы формы
        this.submitButton = ensureElement<HTMLButtonElement>(
            'button[type=submit]',
            this.rootElement
        );
        this.errorContainer = ensureElement<HTMLElement>(
            '.form__errors',
            this.rootElement
        );

        // Назначаем слушатели на форму
        this.setupEventListeners();
    }

    // Устанавливает обработчики событий формы
    private setupEventListeners(): void {
        // При вводе в поле формы отправляем событие изменения поля
        this.formElement.addEventListener('input', (e: Event) => {
            const input = e.target as HTMLInputElement;
            this.handleFieldChange(input.name as keyof T, input.value);
        });

        // При сабмите формы отменяем поведение по умолчанию и отправляем событие
        this.formElement.addEventListener('submit', (e: Event) => {
            e.preventDefault();
            this.eventSystem.emit(`${this.formElement.name}:submit`);
        });
    }

    // Обработка изменения поля — отправляем событие с именем и значением поля
    protected handleFieldChange(field: keyof T, value: string): void {
        this.eventSystem.emit(
            `${this.formElement.name}.${String(field)}:change`,
            { field, value }
        );
    }

    // Управление кнопкой сабмита: активна, если форма валидна
    set formValid(isValid: boolean) {
        this.changeDisabledState(this.submitButton, !isValid);
    }

    // Выводим ошибки в контейнер
    set formErrors(message: string) {
        this.updateTextContent(this.errorContainer, message);
    }

    // Обновление данных формы и её состояния (для использования вместе с draw-архитектурой)
    draw(state: Partial<T> & IFormStatus): HTMLFormElement {
        const { isValid, errorMessages, ...formData } = state;
        super.draw({ isValid, errorMessages }); // Вызов базовой отрисовки
        Object.assign(this, formData); // Копируем остальные поля в текущий объект
        return this.formElement;
    }
}
