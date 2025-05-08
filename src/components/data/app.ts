import { Model } from '../base/model';
import {IAppState,IOrder,IProduct,FormErrors,IOrderForm,IOrderContact } from '../../types/index';

// Тип события, уведомляющего об изменении каталога
export type CatalogChangeEvent = {
	catalog: IProduct[];
};

// Класс AppState — хранилище состояния приложения 
export class AppState extends Model<IAppState> {
	basket: IProduct[] = [];
	catalog: IProduct[];
	formErrors: FormErrors = {};
	order: IOrder = {
		total: 0,
		items: [],
		payment: '',
		address: '',
		email: '',
		phone: '',
	};
	//Устанавливает каталог товаров и сообщает об изменении
	setCatalog(items: IProduct[]) {
		this.catalog = items;
		this.emitChanges('items:changed');
	}
	//Добавляет ID товара в заказ
	addOrderID(item: IProduct) {
		this.order.items.push(item.id);
	}
	//Удаляет ID товара в заказ
	removeOrderID(item: IProduct) {
		const index = this.order.items.indexOf(item.id);
		if (index >= 0) {
			this.order.items.splice(index, 1);
		}
	}
	// Добавляет товар в корзину
	addToBasket(item: IProduct) {
		this.basket.push(item);
	}
	//Удаляет товар из корзины
	removeBasket(item: IProduct) {
		const index = this.basket.indexOf(item);
		if (index >= 0) {
			this.basket.splice(index, 1);
		}
	}
	//Очищение корзины
	clearBasket() {
		this.basket = [];
		this.order.items = [];
	}
	//Вычисление общей суммы товара
	getTotal() {
		return this.order.items.reduce(
			(a, c) => a + this.catalog.find((it) => it.id === c).price,
			0
		);
	}
	//Установка поля заказа и включение валидации
	setOrderField(field: keyof IOrderContact, value: string): void {
		if (field === 'payment' || field === 'address') {
			this.order[field] = value;
			this.validateOrderForm();
		}
	}
	//Установка контактного поля заказа 
	setContactsField(field: keyof IOrderForm, value: string): void {
		if (field === 'email' || field === 'phone') {
			this.order[field] = value;
			this.validateContactsForm();
		}
	}
	//Проверка товара в корзине
	containsProduct(item: IProduct) {
		return this.basket.includes(item);
	}
	//Валидация полей формы доставки и оплаты с сохранением ошибки
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
	//Возвращает true при пустой корзине
	get isEmpty(): boolean {
		return this.basket.length === 0;
	}

	
}
