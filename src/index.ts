import './scss/styles.scss';
import { Api } from "./components/base/api";
import { EventEmitter } from "./components/base/events";
import { API_URL } from "./utils/constants";
import { ensureElement } from "./utils/utils";

const api = new Api(API_URL);
const eventBus = new EventEmitter();

// Пример вызова API с типизацией для fetch
api.get('/products')
    .then((response: Response) => {
        if (response.ok) {
            return response.json(); // Декодируем JSON
        }
        return response.text().then(text => {
            console.error('Ошибка на сервере: ', text);
            throw new Error('Ошибка на сервере: ' + response.status);
        });
    })
    .then(data => console.log("Products:", data))
    .catch(error => console.error("API Error:", error));

// Пример работы с событиями
eventBus.on("user:login", (user) => {
    console.log("User logged in:", user);
});

// Проверяем, существует ли элемент с нужным классом, например, .page__wrapper
const mainContainer = document.querySelector<HTMLElement>(".page__wrapper");

// Автоматическое закрытие модального окна после загрузки страницы
window.onload = () => {
    const modal: HTMLElement | null = document.querySelector('.modal.modal_active'); // Ищем активное модальное окно

    if (modal) {
        const closeButton: HTMLElement | null = modal.querySelector('.modal__close'); // Кнопка закрытия
        if (closeButton) {
            // Имитируем клик по кнопке закрытия
            closeButton.click();
        }
    }
};

// Экспортируем для доступа в других модулях
export { api, eventBus, mainContainer };
