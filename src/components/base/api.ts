// Универсальный тип ответа от API, содержащий список объектов и общее количество
export type ApiListResponse<Type> = {
	total: number;
	items: Type[];
};

// Перечисление допустимых HTTP-методов для отправки данных
export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

// Класс для работы с API — содержит базовую реализацию GET и POST запросов
export class Api {
	readonly baseUrl: string;
	protected options: RequestInit;

	constructor(baseUrl: string, options: RequestInit = {}) {
		this.baseUrl = baseUrl;
		// Инициализация заголовков и других опций
		this.options = {
			headers: {
				'Content-Type': 'application/json',
				...((options.headers as object) ?? {}),
			},
		};
	}
	// Метод для обработки ответа от сервера
	protected handleResponse(response: Response): Promise<object> {
		if (response.ok) return response.json();
		else
			return response
				.json()
				.then((data) => Promise.reject(data.error ?? response.statusText));
	}

	get(uri: string) {
		return fetch(this.baseUrl + uri, {
			...this.options,
			method: 'GET',
		}).then(this.handleResponse);
	}

	post(uri: string, data: object, method: ApiPostMethods = 'POST') {
		return fetch(this.baseUrl + uri, {
			...this.options,
			method,
			body: JSON.stringify(data),
		}).then(this.handleResponse);
	}
}
