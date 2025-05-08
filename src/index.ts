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

// Для отладки событий
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

// Модель данных приложения
const appData = new AppState({}, events);

// Глобальные контейнеры
const page = new AppPage(document.body, events);
const modal = new Popup(ensureElement<HTMLElement>('#modal-container'), events);

// Переиспользуемые компоненты
const basket = new Cart(cloneTemplate(basketTemplate), events);
const order = new OrderForm(cloneTemplate(orderTemplate), events);
const contacts = new ContactDetailsForm(cloneTemplate(contactsTemplate), events);

// Обновление каталога товаров
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
});

// Добавление товара в корзину
events.on('card:add', (item: IProduct) => {
    appData.addOrderID(item);
    appData.addToBasket(item);
    page.basketItemsCount = appData.basket.length;
    modal.close();
});

// Открытие корзины
events.on('basket:opened', () => {
    basket.updateTotal = appData.getTotal();
    basket.selectedItems = appData.order.items;
    basket.setItems = appData.basket.map((item, index) => {
        const card = new CardBasket(cloneTemplate(cardBasketTemplate), {
            onClick: () => events.emit('card:remove', item)
        });
        return card.draw({
            title: item.title,
            price: item.price,
            index: index + 1
        } as any); // Временное решение для совместимости типов
    });
    modal.content = basket.draw({} as any);
    modal.open();
});

// Удаление товара из корзины
events.on('card:remove', (item: IProduct) => {
    appData.removeBasket(item);
    appData.removeOrderID(item);
    page.basketItemsCount = appData.basket.length;
    basket.selectedItems = appData.order.items;
    basket.updateTotal = appData.getTotal();
    basket.setItems = appData.basket.map((item, index) => {
        const card = new CardBasket(cloneTemplate(cardBasketTemplate), {
            onClick: () => events.emit('card:remove', item)
        });
        return card.draw({
            title: item.title,
            price: item.price,
            index: index + 1
        } as any); // Временное решение для совместимости типов
    });
});

// Оформление заказа
events.on('order:open', () => {
    modal.content = order.draw({
        isValid: false,
        errorMessages: []
    } as any);
});

// Переход к контактам
events.on('order:submit', () => {
    appData.order.total = appData.getTotal();
    modal.content = contacts.draw({
        isValid: false,
        errorMessages: []
    } as any);
});

// Валидация форм
events.on('formErrors:change', (errors: Partial<IOrder>) => {
    const { email, phone, address, payment } = errors;
    order.formValid = !address && !payment;
    contacts.formValid = !email && !phone;
    order.formErrors = Object.values({ address, payment }).filter(i => !!i).join('; ');
    contacts.formErrors = Object.values({ phone, email }).filter(i => !!i).join('; ');
});

// Выбор способа оплаты
events.on('payment:changed', (item: HTMLButtonElement) => {
    appData.order.payment = item.name;
    appData.validateOrderForm();
});

// Для формы заказа (Order)
events.on(/^order\.(payment|address):change/, (data: { field: keyof IOrderContact; value: string }) => {
    if (data.field === 'payment' || data.field === 'address') {
        appData.setOrderField(data.field, data.value);
    }
});

// Для формы контактов (Contacts)
events.on(/^contacts\.(email|phone):change/, (data: { field: keyof IOrderForm; value: string }) => {
    if (data.field === 'email' || data.field === 'phone') {
        appData.setContactsField(data.field, data.value);
    }
});

// Отправка заказа
events.on('contacts:submit', () => {
    api.orderProduct(appData.order)
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

// Управление блокировкой страницы
events.on('popup:opened', () => {
    page.scrollLocked = true;
});

events.on('popup:closed', () => {
    page.scrollLocked = false;
});

// Загрузка товаров
api.getProductList()
    .then(appData.setCatalog.bind(appData))
    .catch(console.error);

    //Открытие модального окна карточки товара
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
    