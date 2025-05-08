# Архитектура проекта
В проекте используется паттерн **MVC (Model-View-Controller)**.
Связь между слоями реализована через событийный брокер EventEmitter, который инкапсулирует подписку и генерацию событий. Это позволяет модулям взаимодействовать только через события, не зная напрямую друг о друге.

## EventEmitter
События используются для:
* получения данных от пользователя (клик, ввод текста, отправка формы);
* передачи данных в интерфейс (обновление корзины, открытие/закрытие модальных окон, переход между экранами).

Пример использования событий:
```ts
button.addEventListener('click', () => eventEmitter.emit('basket:add', productId));
eventEmitter.on('basket:add', (productId) => { /* обработка добавления товара */ });
```

# Model
## Product
Представляет товар.
* Атрибуты:
  * `id: number`
  * `title: string`
  * `description: string`
  * `price: number`
  * `imageUrl: string`

## Cart
Представляет корзину.
* Атрибуты:
  * `items: Product[]`
* Методы:
  * `add(product: Product)` — добавить товар
  * `remove(productId: number)` — удалить товар
  * `clear()` — очистить корзину
  * `getTotal(): number` — получить итоговую сумму
  * `getItems(): Product[]` — получить список товаров

## Order
Модель заказа, содержащая данные пользователя.
* Атрибуты:
  * `name: string`
  * `email: string`
  * `phone: string`
  * `address: string`
  * `paymentMethod: string`
* Методы:
  * `setField(field: string, value: string)` — записать значение в поле
  * `validate(): boolean` — валидация всех полей

# View
## ProductCardView
Компонент отображения карточки товара.
* Методы:
  * `render(product: Product)` — отрисовать карточку товара
  * Привязка событий к кнопке "Добавить в корзину"

## CartView
Компонент отображения корзины.
* Методы:
  * `renderCartItems(items: HTMLElement)` — отрисовать список товаров
  * `renderTotal(total: number)` — отобразить итоговую сумму

## ModalView
Модальное окно.
* Методы:
  * `open(content: HTMLElement)` — открыть модалку
  * `close()` — закрыть модалку

## OrderDetailsView
Экран оформления заказа.
* Методы:
  * `render()` — отрисовать форму заказа
  * Обработка событий через `EventEmitter`

## OrderSuccessView
Экран после успешного заказа.
* Методы:
  * `render()` — сообщение об успехе

## FormHandler<T>
Базовый обработчик форм.
* Атрибуты:

  * `submitButton: HTMLButtonElement`
  * `errorContainer: HTMLElement`

* Методы:
  * `draw(state: Partial<T> & IFormStatus)` — отрисовать состояние формы
  * `formValid = boolean` — установить доступность кнопки отправки
  * `formErrors = string` — вывести сообщение об ошибке

## ContactDetailsForm extends FormHandler<IOrderForm>
Обработчик формы контактных данных пользователя.
* Методы:
  * `customerPhone = string` — установить номер телефона
  * `customerEmail = string` — установить email
  * `formValues` — получить текущие значения формы

# Controller
## ShopController
Координирует работу приложения.
* Методы:
  * `init()` — инициализация
  * `handleAddToCart(productId)` — добавление товара в корзину
  * `handleRemoveFromCart(productId)` — удаление товара
  * `handleCheckout()` — начало оформления
  * `handleFormSubmit(formData)` — отправка формы
  * `handleOrderSuccess()` — переход к экрану успеха

# Service
## Api
Работа с REST API.
* Методы:
  * `get(uri: string)` — GET-запрос
  * `post(uri: string, data: object)` — POST/PUT/DELETE-запрос
  * `handleResponse(response: Response)` — обработка ответа сервера

## EventEmitter
Работа с событиями.
* Методы:
  * `on(eventName, cb)` — подписка
  * `emit(eventName, data)` — вызов
  * `off(eventName, cb)` — отписка
  * `onAll(cb)` — все события

# Утилиты
Файл `utils.ts`:
* `ensureElement` — безопасное получение одного элемента
* `ensureAllElements` — безопасное получение нескольких
* `cloneTemplate` — клонирование шаблона
* `createElement` — создание элемента
* `setElementData`, `getElementData` — работа с data-атрибутами
* `pascalToKebab`, `isPlainObject`, `isBoolean`, `isEmpty` — проверки типов

# Важные файлы проекта
* `components/api.ts` — API-клиент
* `components/events.ts` — EventEmitter
* `components/form.ts` — базовый FormHandler
* `components/contact-form.ts` — форма контактных данных
* `types/model.ts` — типы `Product`, `Order`
* `utils/utils.ts` — утилиты
* `utils/constants.ts` — константы (`API_URL`, `CDN_URL`)

# Установка и запуск
```bash
npm install
npm run dev
```
