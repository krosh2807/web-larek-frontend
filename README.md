
## Архитектура проекта

В проекте используется паттерн MVC (Model-View-Controller). Связь между слоями реализована через событийный брокер EventEmitter, 
который инкапсулирует подписку и генерацию событий.Это позволяет модулям не знать напрямую о существовании друг друга и взаимодействовать 
только через события.

Как работает EventEmitter
События используются как для:
получения данных от пользователя (например, клик, ввод, отправка формы),
так и для передачи обновлений от контроллера в интерфейс (например, обновление корзины, открытие/закрытие модалок и т.д.).

Класс EventEmitter реализует:
-on(event, callback) — подписка на событие,
-emit(event, data) — вызов события с передачей данных,
-trigger(event, context) — возвращает callback, который вызывает событие.

Примеры событий от View к Controller
-product:select — пользователь кликнул на карточку товара; контроллер должен загрузить данные и открыть модалку.
-button:add-to-cart — клик по кнопке "в корзину"; контроллер добавляет товар в модель корзины.
-button:remove-from-cart — клик по кнопке удаления из корзины; контроллер обновляет модель.
-form:submit — пользователь отправил форму оформления заказа; происходит валидация и вызов API.
-modal:close — закрытие окна; интерфейс прячет модалку.

Примеры событий от Controller к View
-cart:changed — модель корзины обновилась; View должен перерисовать содержимое корзины.
-modal:open — нужно показать модальное окно товара.
-modal:close — нужно закрыть модальное окно.
-form:error — ошибка при отправке формы; нужно отобразить сообщение об ошибке.
-form:success — заказ оформлен; показать уведомление об успешной отправке.
-api:error — произошла ошибка на уровне API; показать уведомление или алерт.

## Важные файлы
- `components/api.ts` — класс `Api` для работы с REST API.
- `components/events.ts` — класс `EventEmitter` для событийной архитектуры.
- `types/model.ts` — типы данных: `Product`, `Order`.
- `utils/utils.ts` — вспомогательные функции для работы с DOM.
- `utils/constants.ts` — константы (`API_URL`, `CDN_URL`).

## Реализованные классы
### Api (Model Layer)
**Файл:** `components/api.ts`
Класс для взаимодействия с API. Работает с базовым URL и методами HTTP.

**Атрибуты:**
- `baseUrl: string` — базовый URL для запросов.
- `options: RequestInit` — базовая конфигурация fetch-запросов (в т.ч. заголовки).

**Методы:**
- `get(uri: string): Promise<object>` — GET-запрос по URI.
- `post(uri: string, data: object, method?: 'POST' | 'PUT' | 'DELETE'): Promise<object>` — отправка данных.
- `handleResponse(response: Response): Promise<object>` — обработка ответа от сервера (ошибки, JSON).

### EventEmitter (Controller Layer)
**Файл:** `components/events.ts`
Класс-обёртка для событийной шины. Позволяет подписываться и эмитить события между модулями.

**Атрибуты:**
- `_events: Map<EventName, Set<Subscriber>>` — хранилище подписчиков по событиям.

**Методы:**
- `on(eventName, callback)` — подписка на событие.
- `off(eventName, callback)` — отписка.
- `emit(eventName, data?)` — инициировать событие.
- `onAll(callback)` — подписка на все события.
- `offAll()` — сбросить все подписки.
- `trigger(eventName, context?)` — возвращает callback, вызывающий событие.

**Примеры взаимодействия между слоями:**
- Ввод в форму (View) → `emit("form:submit", data)` → Controller получает и обрабатывает.
- Клик на карточку продукта → `emit("product:select", id)` → обновляется View.

## Типы данных (Model)
### Product
--ts
{
  id: number;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
}
Описывает единицу товара в магазине.

### Order
--ts
{
  id: number;
  userId: number;
  products: Product[];
  totalPrice: number;
}
Заказ, содержащий несколько товаров.

## Утилиты

Файл: `utils/utils.ts`
Функции для:
- Проверки селекторов (`isSelector`, `ensureElement`, `ensureAllElements`)
- Шаблонов классов по БЭМ (`bem`)
- Работа с DOM-элементами (`cloneTemplate`, `createElement`)
- Работа с `dataset` (`setElementData`, `getElementData`)
- Прочее: `isPlainObject`, `isEmpty`, `isBoolean`


## Установка и запусл

--bash
npm install
npm run dev
