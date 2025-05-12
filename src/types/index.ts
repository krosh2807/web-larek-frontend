// Тип категории товара
export type CatalogItemStatus = {
	category: 'софт-скил' | 'хард-скил' | 'другое' | 'кнопка' | 'дополнительное';
};

// Интерфейс, описывающий карточку товара
export interface IProduct {
	id: string; 
	description: string; 
	image: string; 
	title: string; 
	category: string; 
	price: number | null; 
}

// Интерфейс для класса ContactsForm
export interface IOrderForm {
	email: string; 
	phone: string; 
}

// Интерфейс для класса Order
export interface IOrderContact {
	payment: string; 
	address: string; 
}

// Интерфейс IOrder, расширяющий IOrderForm и IOrderContact
export interface IOrder extends IOrderForm, IOrderContact {
	total: number; 
	items: string[]; 
}

// Интерфейс для создание заказа
export interface IOrderAnswer {
	total: number; 
	success: boolean;
}

// Интерфейс для класса AppState
export interface IAppState {
	catalog: IProduct[]; 
	basket: string[]; 
	order: IOrder; 
}

// Интерфейс для работы с API магазина
export interface IStoreApi {
	getProductList: () => Promise<IProduct[]>; 
	orderProduct: (value: IOrder) => Promise<IOrderAnswer>; 
}

// Интерфейс для класса Page
export interface IPage {
	counter: HTMLElement; 
	catalog: HTMLElement; 
	basket: HTMLElement; 
}

//Тип **FormErrors**, который используется для представления ошибок формы
export type FormErrors = Partial<Record<keyof IOrder, string>>;
