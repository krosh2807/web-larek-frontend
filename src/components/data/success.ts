import { UiComponent } from '../base/component';
import { ensureElement } from '../../utils/utils';

//Интерфейс описывающий данные
interface IPurchaseResult {
    amount: number;
}

//Интерфейс описывающий доступные действия
interface IPurchaseResultActions {
    onClose: () => void;
}

//Для подтверждения успешной покупки товара
export class PurchaseConfirmation extends UiComponent<IPurchaseResult> {
    protected closeButton: HTMLElement;
    protected amountDisplay: HTMLElement;

    constructor(
        container: HTMLElement,
        actions?: IPurchaseResultActions
    ) {
        super(container);
        
        this.closeButton = ensureElement<HTMLElement>(
            '.order-success__close',
            this.rootElement
        );
        this.amountDisplay = ensureElement<HTMLElement>(
            '.order-success__description',
            this.rootElement
        );

        this.setupCloseHandler(actions?.onClose);
    }
    //Обработчик события для кнопки закрытия 
    private setupCloseHandler(handler?: () => void): void {
        if (handler) {
            this.closeButton.addEventListener('click', handler);
        }
    }
        draw(data: IPurchaseResult): HTMLElement {
            this.transactionAmount = data.amount;
            return super.draw(data);
        }

    //Отображение списания 
    set transactionAmount(value: number) {
        this.updateTextContent(
            this.amountDisplay,
            `Сумма списания: ${value} синапсов`
        );
    }
}