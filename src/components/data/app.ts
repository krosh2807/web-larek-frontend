import { Model } from '../base/model';
import { IAppState, IOrder, IProduct, FormErrors, IOrderForm, IOrderContact } from '../../types/index';

export type CatalogChangeEvent = {
	catalog: IProduct[];
};

export class AppState extends Model<IAppState> {
	basket: IProduct[] = [];
	catalog: IProduct[];
	formErrors: FormErrors = {};
	order: IOrder = {
		total: 0,
		payment: '',
		address: '',
		email: '',
		phone: '',
		items: [] // <- будет формироваться динамически
	};

	setCatalog(items: IProduct[]) {
		this.catalog = items;
		this.emitChanges('items:changed');
	}

	addToBasket(item: IProduct) {
		this.basket.push(item);
	}

	removeBasket(item: IProduct) {
		const index = this.basket.indexOf(item);
		if (index >= 0) {
			this.basket.splice(index, 1);
		}
	}

	clearBasket() {
		this.basket = [];
	}

	getTotal() {
		return this.basket.reduce((a, c) => a + c.price, 0);
	}

	setOrderField(field: keyof IOrderContact, value: string): void {
		if (field === 'payment' || field === 'address') {
			this.order[field] = value;
			this.validateOrderForm();
		}
	}

	setContactsField(field: keyof IOrderForm, value: string): void {
		if (field === 'email' || field === 'phone') {
			this.order[field] = value;
			this.validateContactsForm();
		}
	}

	containsProduct(item: IProduct) {
		return this.basket.includes(item);
	}

	validateOrderForm() {
		const errors: typeof this.formErrors = {};
		if (!this.order.address) {
			errors.address = 'Необходимо указать адрес';
		}
		if (!this.order.payment) {
			errors.address = 'Необходимо выбрать способ оплаты';
		}
		this.formErrors = errors;
		this.events.emit('formErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}

	validateContactsForm() {
		const errors: typeof this.formErrors = {};
		if (!this.order.email) {
			errors.email = 'Необходимо указать email';
		}
		if (!this.order.phone) {
			errors.phone = 'Необходимо указать телефон';
		}
		this.formErrors = errors;
		this.events.emit('formErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}

	getOrder(): IOrder {
		return {
			address: this.order.address,
			payment: this.order.payment,
			email: this.order.email,
			phone: this.order.phone,
			total: this.getTotal(),
			items: this.basket.map(product => product.id)
		};
	}

	get isEmpty(): boolean {
		return this.basket.length === 0;
	}
}
