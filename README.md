Хорошо. Вот структурированный `README.md` без украшательств:

---

# WebLarek

## 1. Структура проекта

- `components/` — классы для API и событий.
- `types/` — типы моделей и утилит.
- `utils/` — функции для DOM и валидации.
- `index.ts` — точка входа.
- `scss/` — стили проекта.

## 2. Важные файлы

- `components/api.ts` — класс `Api`, работа с REST API.
- `components/events.ts` — класс `EventEmitter`, шина событий.
- `types/model.ts` — интерфейсы: `Product`, `Order`.
- `utils/utils.ts` — функции: работа с DOM, шаблоны, проверки.

## 3. Архитектура и классы

### Api (слой Model)

**Назначение:** клиент для HTTP-запросов.

**Атрибуты:**

- `baseUrl`: базовый адрес API.
- `options`: параметры запроса (включая заголовки).

**Методы:**

- `get(uri)` — выполняет GET-запрос.
- `post(uri, data, method)` — выполняет POST/PUT/DELETE.
- `handleResponse(response)` — парсинг ответа или ошибка.

### EventEmitter (слой Controller)

**Назначение:** связывает слои модели и представления через события.

**Атрибуты:**

- `_events`: Map подписок на события.

**Методы:**

- `on(event, callback)` — подписка на событие.
- `off(event, callback)` — отписка.
- `emit(event, data)` — вызов события.
- `onAll(callback)` — подписка на все события.
- `offAll()` — очистка всех подписок.
- `trigger(event, context)` — генерация события через замыкание.

### Типы моделей (слой Model)

**Product:**

- `id`, `title`, `description`, `price`, `imageUrl`.

**Order:**

- `id`, `userId`, `products`, `totalPrice`.

### Утилиты (View Helpers)

**Назначение:** работа с DOM, шаблонами, классами и dataset.

**Основные функции:**

- `ensureElement(selector)`, `ensureAllElements(selector)` — поиск элементов.
- `cloneTemplate(template)` — клонирование шаблонов.
- `createElement(tag, props, children)` — создание элементов.
- `bem(block, element?, modifier?)` — генерация классов.
- `setElementData(el, data)`, `getElementData(el, scheme)` — работа с dataset.
- `isSelector`, `isPlainObject`, `isBoolean`, `isEmpty` — проверки.

## 4. Взаимодействие между слоями

**Механизм:** EventEmitter.

**Сценарии:**

- Пользователь кликает кнопку → `emit` события.
- Контроллер подписан на это событие → вызывает обновление модели или представления.
- Компоненты не зависят напрямую друг от друга.

**Примеры событий:**

- `user:login` — авторизация.
- `product:add` — добавление товара.
- `cart:update` — обновление корзины.
- `form:submit` — отправка формы.

## 5. Установка и запуск

Установка зависимостей:

```
npm install
```

Запуск в dev-режиме:

```
npm run dev
```

Сборка проекта:

```
npm run build
```