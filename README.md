
## Архитектура проекта

В проекте используется паттерн MVC (Model-View-Controller). Связь между слоями реализована через событийный брокер EventEmitter, 
который инкапсулирует подписку и генерацию событий.Это позволяет модулям не знать напрямую о существовании друг друга и взаимодействовать 
только через события.

Как работает EventEmitter
События используются как для:
получения данных от пользователя (например, клик, ввод, отправка формы),
так и для передачи обновлений от контроллера в интерфейс (например, обновление корзины, открытие/закрытие модалок и т.д.).

### Model
#### Product
Представляет товар.

- **Атрибуты:**
  - `id` — уникальный идентификатор
  - `title` — название
  - `description` — описание
  - `price` — цена
  - `imageUrl` — URL изображения

#### Order
Представляет заказ пользователя.

- **Атрибуты:**
  - `id` — уникальный идентификатор заказа
  - `userId` — идентификатор пользователя
  - `products` — массив продуктов
  - `totalPrice` — итоговая стоимость

#### Cart
(реализуется как отдельный класс в проекте)

- **Атрибуты:**
  - `items` — список товаров в корзине
- **Методы:**
  - `add(product: Product)` — добавить товар
  - `remove(productId: number)` — удалить товар
  - `clear()` — очистить корзину
  - `getTotal()` — получить сумму заказа
  - `getItems()` — получить список товаров

### View
#### ProductCard
Компонент представления карточки товара.

- **Атрибуты:**
  - DOM-элемент карточки
- **Методы:**
  - `render(product: Product)` — отрисовать карточку
  - `bindAddToCart(callback)` — подписка на событие добавления в корзину

#### CartView
Представляет визуальное отображение корзины.

- **Методы:**
  - `render(cart: Cart)` — отрисовка содержимого
  - `bindRemove(callback)` — подписка на удаление товаров
  - `bindCheckout(callback)` — подписка на оформление заказа

#### ModalView
Представляет универсальное модальное окно.

- **Методы:**
  - `open(content: HTMLElement)` — показать модалку
  - `close()` — закрыть модалку
  - `bindClose(callback)` — подписка на событие закрытия

#### OrderFormView
Отображает форму оформления заказа.

- **Методы:**
  - `bindSubmit(callback)` — подписка на отправку формы
  - `renderError(message)` — показать ошибку
  - `renderSuccess()` — показать успешное оформление

### Controller
#### ShopController
Координирует взаимодействие между Model и View.

- **Атрибуты:**
  - `productModel`, `cartModel`, `orderModel`
  - ссылки на view-компоненты
- **Методы:**
  - `init()` — инициализация, загрузка данных
  - `handleAddToCart(productId)` — добавление в корзину
  - `handleRemoveFromCart(productId)` — удаление из корзины
  - `handleFormSubmit(data)` — оформление заказа

### Service
#### Api
Работа с REST API.
- **Атрибуты:**
  - `baseUrl`, `options`
- **Методы:**
  - `get(uri: string)` — GET-запрос
  - `post(uri: string, data: object)` — POST/PUT/DELETE-запрос
  - `handleResponse(response: Response)` — обработка ответа

#### EventEmitter
Обеспечивает событийное взаимодействие между слоями.

- **Методы:**
  - `on(eventName, callback)` — подписка
  - `emit(eventName, data)` — генерация
  - `trigger(eventName, context)` — триггер коллбека
  - `onAll(callback)` — подписка на все события
  - `off(eventName, callback)` — отписка

**Используется для передачи событий между слоями**, например:
- клик на кнопку "добавить в корзину"
- клик на кнопку "оформить заказ"
- отправка формы заказа
- закрытие модального окна

### Утилиты (utils.ts)
- `ensureElement`, `ensureAllElements` — безопасная работа с DOM
- `cloneTemplate` — клонирование DOM-шаблонов
- `getObjectProperties` — introspection
- `setElementData`, `getElementData` — работа с dataset
- `createElement` — генерация DOM-элементов
- `pascalToKebab`, `isPlainObject`, `isBoolean`, `isEmpty` — базовые проверки

## Важные файлы
- `components/api.ts` — класс `Api` для работы с REST API.
- `components/events.ts` — класс `EventEmitter` для событийной архитектуры.
- `types/model.ts` — типы данных: `Product`, `Order`.
- `utils/utils.ts` — вспомогательные функции для работы с DOM.
- `utils/constants.ts` — константы (`API_URL`, `CDN_URL`).

## Установка и запусл

--bash
npm install
npm run dev
