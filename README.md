# Архитектура проекта

В проекте используется паттерн **MVC (Model-View-Controller)**.  
Связь между слоями реализована через событийный брокер `EventEmitter`, который инкапсулирует подписку и генерацию событий. Это позволяет модулям взаимодействовать только через события, не зная напрямую друг о друге.

## EventEmitter

События используются для:
- получения данных от пользователя (клик, ввод текста, отправка формы);
- передачи данных в интерфейс (обновление корзины, открытие/закрытие модальных окон, переход между экранами).

Пример использования событий:
button.addEventListener('click', () => eventEmitter.emit('basket:add', productId));
eventEmitter.on('basket:add', (productId) => { /* обработка добавления товара */ });

# Model
## Product

Представляет товар.

- Атрибуты:
  - `id: number`
  - `title: string`
  - `description: string`
  - `price: number`
  - `imageUrl: string`

## Cart
Представляет корзину.

- Атрибуты:
  - `items: Product[]`

- Методы:
  - `add(product: Product)` — добавить товар
  - `remove(productId: number)` — удалить товар
  - `clear()` — очистить корзину
  - `getTotal(): number` — получить итоговую сумму
  - `getItems(): Product[]` — получить список товаров

## Order
Модель заказа, содержащая данные пользователя.

- Атрибуты:
  - `name: string`
  - `email: string`
  - `phone: string`
  - `address: string`
  - `paymentMethod: string`

- Методы:
  - `setField(field: string, value: string)` — записать значение в поле
  - `validate(): boolean` — валидация всех полей

# View
## ProductCardView

Компонент отображения карточки товара.

- Атрибуты:
  - DOM-элемент карточки

- Методы:
  - `render(product: Product)` — отрисовать карточку
  - привязка событий к кнопке "Добавить в корзину" через `addEventListener` и отправка событий через `EventEmitter`

## CartView
Компонент отображения корзины.

- Атрибуты:
  - контейнер для списка товаров
  - элемент отображения итоговой суммы
  - кнопки для удаления товаров и оформления заказа

- Методы:
  - `renderCartItems(items: HTMLElement)` — отрисовать список товаров
  - `renderTotal(total: number)` — обновить итоговую сумму
  - обработка событий удаления товаров и оформления заказа через `EventEmitter`

## ModalView
Универсальное модальное окно.

- Атрибуты:
  - контейнер модалки
  - кнопка закрытия

- Методы:
  - `open(content: HTMLElement)` — открыть модалку с переданным контентом
  - `close()` — закрыть модалку
  - привязка событий закрытия через `EventEmitter`

## OrderDetailsView
Экран ввода данных пользователя при оформлении заказа.

- Атрибуты:
  - инпуты: имя, email, телефон, адрес, метод оплаты

- Методы:
  - `render()` — отрисовать форму
  - обработка событий ввода и отправки формы через `EventEmitter`
  - отображение ошибок валидации

## OrderSuccessView
Экран успешного оформления заказа.

- Атрибуты:
  - сообщение об успешном заказе
  - кнопка возврата на главную страницу

- Методы:
  - `render()` — отрисовать сообщение об успехе
  - обработка клика на кнопку возврата через `EventEmitter`

# Controller
## ShopController

Координирует работу моделей и представлений.

- Атрибуты:
  - `productModel: Product[]`
  - `cartModel: Cart`
  - `orderModel: Order`
  - ссылки на компоненты представления: `ProductCardView`, `CartView`, `ModalView`, `OrderDetailsView`, `OrderSuccessView`

- Методы:
  - `init()` — инициализация приложения
  - `handleAddToCart(productId)` — добавить товар в корзину
  - `handleRemoveFromCart(productId)` — удалить товар из корзины
  - `handleCheckout()` — начать процесс оформления заказа
  - `handleFormSubmit(formData)` — обработать отправку данных заказа
  - `handleOrderSuccess()` — показать экран успешного заказа

# Service
## Api

Работа с REST API.

- Атрибуты:
  - `baseUrl: string`
  - `options: object`

- Методы:
  - `get(uri: string): Promise<any>` — отправить GET-запрос
  - `post(uri: string, data: object): Promise<any>` — отправить POST-запрос
  - `handleResponse(response: Response): Promise<any>` — обработать ответ сервера

## EventEmitter
Сервис событийного взаимодействия.

- Методы:
  - `on(eventName: string, callback: Function)` — подписаться на событие
  - `emit(eventName: string, data?: any)` — вызвать событие
  - `off(eventName: string, callback: Function)` — отписаться от события
  - `onAll(callback: Function)` — подписаться на все события

Типичные события:
- Клик на кнопку "Добавить в корзину"
- Клик на кнопку "Оформить заказ"
- Отправка формы заказа
- Открытие/закрытие модального окна
- Переход между экранами оформления заказа

# Утилиты

Файл `utils.ts`:

- `ensureElement` — безопасное получение одного элемента
- `ensureAllElements` — безопасное получение нескольких элементов
- `cloneTemplate` — клонирование DOM-шаблона
- `createElement` — создание нового DOM-элемента
- `setElementData`, `getElementData` — работа с атрибутами `data-*`
- `pascalToKebab`, `isPlainObject`, `isBoolean`, `isEmpty` — базовые утилиты для проверки типов

# Важные файлы проекта

- `components/api.ts` — класс для работы с API
- `components/events.ts` — реализация EventEmitter
- `types/model.ts` — описания типов `Product`, `Order`
- `utils/utils.ts` — вспомогательные функции для работы с DOM и проверки данных
- `utils/constants.ts` — константы проекта (`API_URL`, `CDN_URL`)

# Установка и запуск

npm install
npm run dev


