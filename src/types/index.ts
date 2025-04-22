import { User, Product, Order } from "./model";

// Тип ответа от API для списка сущностей
export type ApiListResponse<T> = {
    total: number;
    items: T[];
};

// HTTP-методы для пост-запросов
export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

// Типы событий
export type EventName = string | RegExp;
export type Subscriber = (data: any) => void;
export interface EmitterEvent {
    eventName: string;
    data: unknown;
}

// Интерфейс событийного брокера
export interface IEvents {
    on<T extends object>(event: EventName, callback: (data: T) => void): void;
    emit<T extends object>(event: string, data?: T): void;
    trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void;
}

// Утилиты для работы с DOM
export type SelectorElement<T> = T | string;
export type SelectorCollection<T> = string | NodeListOf<Element> | T[];
