import { UiComponent } from '../base/component';
import { ensureElement } from '../../utils/utils';
import { CategoryType } from '../../utils/constants';

interface ICardActions {
    onClick: () => void;
}

//Интерфейс описывает струтуру товара
export interface IProduct {
    id: string;
    title: string;
    category: keyof typeof CategoryType;
    description?: string;
    image: string;
    price: number | null;
}

//Интерфейс расширяет IProduct
interface IBasketItem extends IProduct {
    index?: number;
}

//Отображение карточки товара
export class Card<T extends IProduct = IProduct> extends UiComponent<T> {
	protected _title?: HTMLElement;
	protected _image?: HTMLImageElement;
	protected _price?: HTMLElement;
	protected _category?: HTMLElement;
	protected container: HTMLElement;

	constructor(protected blockName: string, container: HTMLElement, actions?: ICardActions) {
		super(container);
		this.container = container;

		this._title = container.querySelector(`.${blockName}__title`) ?? undefined;
		this._image = container.querySelector(`.${blockName}__image`) ?? undefined;
		this._price = container.querySelector(`.${blockName}__price`) ?? undefined;
		this._category = container.querySelector(`.${blockName}__category`) ?? undefined;

		if (actions?.onClick) {
			container.addEventListener('click', () => actions.onClick());
		}
	}

	set id(value: string) {
		this.container.dataset.id = value;
	}

	set title(value: string) {
		if (this._title) {
			this.updateTextContent(this._title, value);
		}
	}

	set image(value: string) {
		if (this._image) {
			this.configureImage(this._image, value);
		}
	}

	set price(value: number | null) {
		if (this._price) {
			this.updateTextContent(this._price, value ? `${value} синапсов` : 'Бесценно');
		}
	}

	set category(value: keyof typeof CategoryType) {
		if (this._category) {
			this.updateTextContent(this._category, value);
			this._category.className = `${this.blockName}__category`;
			this._category.classList.add(`${this.blockName}__category_${CategoryType[value]}`);
		}
	}
}

//Расщирение Cardи поддержка описания
export class CardPreview extends Card {
    protected _description: HTMLElement;
    protected _button: HTMLButtonElement;

    constructor(container: HTMLElement, actions?: ICardActions) {
        super('card', container);
        
        this._description = ensureElement<HTMLElement>('.card__text', container);
        this._button = ensureElement<HTMLButtonElement>('.card__button', container);

        if (actions?.onClick) {
            this._button.addEventListener('click', () => actions.onClick());
        }
    }

    set description(value: string) {
        this.updateTextContent(this._description, value);
    }

    set buttonDisabled(state: boolean) {
        this.changeDisabledState(this._button, state);
    }
}

//Отображение карточки товара в корзине
export class CardBasket extends Card<IBasketItem> {
    protected _index: HTMLElement;

    constructor(container: HTMLElement, actions?: ICardActions) {
        super('card', container, actions);
        this._index = ensureElement<HTMLElement>('.basket__item-index', container);
    }

    set index(value: number) {
        this.updateTextContent(this._index, value.toString());
    }
}