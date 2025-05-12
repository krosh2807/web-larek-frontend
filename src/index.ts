import './scss/styles.scss';
import { StoreAPI } from './components/data/api';
import { API_URL, CDN_URL, CategoryType } from './utils/constants';
import { EventEmitter } from './components/base/events';
import { AppState } from './components/data/app';
import { cloneTemplate, ensureElement } from './utils/utils';
import { Card, CardPreview, CardBasket } from './components/data/card';
import { AppPage } from './components/data/page';
import { Popup } from './components/data/modal';
import { OrderForm } from './components/data/order';
import { ContactDetailsForm } from './components/data/contacts';
import { Cart } from './components/data/basket';
import { PurchaseConfirmation } from './components/data/success';
import { IProduct, IOrder, IOrderForm, IOrderContact } from './types/index';

const events = new EventEmitter();
const api = new StoreAPI(CDN_URL, API_URL);

// Отладка событий
events.onAll(({ eventName, data }) => {
	console.log(eventName, data);
});

// Шаблоны
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

// Модель приложения
const appData = new AppState({}, events);

// Глобальные компоненты
const page = new AppPage(document.body, events);
const modal = new Popup(ensureElement<HTMLElement>('#modal-container'), events);

// Переиспользуемые формы
const basket = new Cart(cloneTemplate(basketTemplate), events);
const order = new OrderForm(cloneTemplate(orderTemplate), events);
const contacts = new ContactDetailsForm(cloneTemplate(contactsTemplate), events);

// Отрисовка каталога товаров
events.on('items:changed', () => {
	page.galleryContent = appData.catalog.map(item => {
		const card = new Card('card', cloneTemplate(cardCatalogTemplate), {
			onClick: () => events.emit('card:select', item)
		});
		return card.draw({
			id: item.id,
			title: item.title,
			image: item.image,
			price: item.price,
			category: item.category as keyof typeof CategoryType
		});
	});
});

// Просмотр карточки товара
events.on('card:select', (item: IProduct) => {
	const card = new CardPreview(cloneTemplate(cardPreviewTemplate), {
		onClick: () => events.emit('card:add', item)
	});

	modal.content = card.draw({
		id: item.id,
		title: item.title,
		image: item.image,
		price: item.price,
		category: item.category as keyof typeof CategoryType,
		description: item.description
	});

	card.buttonDisabled = item.price === null || appData.containsProduct(item);
	modal.open();
});

// Добавление товара в корзину
events.on('card:add', (item: IProduct) => {
	appData.addToBasket(item);
	page.basketItemsCount = appData.basket.length;

	order.formValid = appData.basket.length > 0;
	order.formErrors = appData.basket.length === 0 ? 'Корзина пуста' : '';

	events.emit('basket:change');
	modal.close();
});

// Обновление содержимого корзины
events.on('basket:change', () => {
	basket.selectedItems = appData.basket.map(() => document.createElement('div'));
	basket.updateTotal = appData.getTotal();
	basket.setItems = appData.basket.map((item, index) => {
		const card = new CardBasket(cloneTemplate(cardBasketTemplate), {
			onClick: () => events.emit('card:remove', item)
		});
		return card.draw({
			title: item.title,
			price: item.price,
			index: index + 1
		});
	});
});

// Открытие корзины
events.on('basket:opened', () => {
	events.emit('basket:change'); // не перечитываем, только обновляем представление
	modal.content = basket.draw({} as any);
	modal.open();
});

// Удаление товара из корзины
events.on('card:remove', (item: IProduct) => {
	appData.removeBasket(item);
	page.basketItemsCount = appData.basket.length;
	events.emit('basket:change');
});

// Открытие формы заказа
events.on('order:open', () => {
	modal.content = order.draw({
		isValid: false,
		errorMessages: []
	} as any);

	appData.validateOrderForm();
});

// Переход к контактам
events.on('order:submit', () => {
	appData.order.total = appData.getTotal();
	modal.content = contacts.draw({
		isValid: false,
		errorMessages: []
	} as any);

	appData.validateContactsForm();
});

// Валидация форм
events.on('formErrors:change', (errors: Partial<IOrder>) => {
	const { email, phone, address, payment } = errors;

	order.formValid = appData.basket.length > 0 && !address && !payment;
	contacts.formValid = !email && !phone;

	order.formErrors = Object.values({ address, payment }).filter(Boolean).join('; ');
	contacts.formErrors = Object.values({ phone, email }).filter(Boolean).join('; ');
});

// Смена способа оплаты
events.on('payment:changed', (item: HTMLButtonElement) => {
	appData.order.payment = item.name;
	appData.validateOrderForm();
});

// Обработка ввода данных в форму заказа
events.on(/^order\.(payment|address):change/, (data: { field: keyof IOrderContact; value: string }) => {
	appData.setOrderField(data.field, data.value);
});

// Обработка ввода данных в форму контактов
events.on(/^contacts\.(email|phone):change/, (data: { field: keyof IOrderForm; value: string }) => {
	appData.setContactsField(data.field, data.value);
});

// Отправка заказа
events.on('contacts:submit', () => {
	const orderPayload = {
		...appData.getOrder(),
		total: appData.getTotal(),
		items: appData.basket.map(product => product.id)
	};

	api.orderProduct(orderPayload)
		.then(res => {
			const success = new PurchaseConfirmation(cloneTemplate(successTemplate), {
				onClose: () => modal.close()
			});

			modal.content = success.draw({
				amount: res.total
			});

			appData.clearBasket();
			page.basketItemsCount = 0;
		})
		.catch(console.error);
});

// Блокировка прокрутки при открытии/закрытии модалки
events.on('popup:opened', () => {
	page.scrollLocked = true;
});

events.on('popup:closed', () => {
	page.scrollLocked = false;
});

// Загрузка каталога товаров
api.getProductList()
	.then(appData.setCatalog.bind(appData))
	.catch(console.error);
