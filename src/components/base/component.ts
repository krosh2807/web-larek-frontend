//Абстрактный класс для работы с DOM элементами
export abstract class UiComponent<T> {
	constructor(protected readonly rootElement: HTMLElement) {}
  
	// Изменяет состояние CSS класса элемента
	changeClassState(
	  element: HTMLElement, 
	  className: string, 
	  state?: boolean
	): void {
	  element.classList.toggle(className, state);
	}
  
	// Обновляет текстовое содержимое элемента
	updateTextContent(element: HTMLElement, value: unknown): void {
	  element && (element.textContent = String(value));
	}
  
	// Управляет состоянием disabled атрибута
	changeDisabledState(element: HTMLElement, isDisabled: boolean): void {
	  if (!element) return;
	  
	  isDisabled 
		? element.setAttribute('disabled', 'true') 
		: element.removeAttribute('disabled');
	}
  
	// Скрывает элемент
	hideElement(element: HTMLElement): void {
	  element.style.display = 'none';
	}
  
	// Показывает элемент
	showElement(element: HTMLElement): void {
	  element.style.display = '';
	}
  
	// Устанавливает параметры изображения
	configureImage(
	  element: HTMLImageElement, 
	  source: string, 
	  description?: string
	): void {
	  if (!element) return;
	  
	  element.src = source;
	  description && (element.alt = description);
	}
  
	// Отрисовывает компонент с переданными данными
	draw(data?: Partial<T>): HTMLElement {
	  Object.assign(this as object, data ?? {});
	  return this.rootElement;
	}
  }