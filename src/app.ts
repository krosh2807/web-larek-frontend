import { AppState } from "./components/data/app";
import { EventEmitter } from "./components/base/events";
import { Popup } from "./components/data/modal"; 
import { Cart } from "./components/data/basket"; 

//Инициализация UI-компонентов
export class App {
    protected popup: Popup;
    protected cart: Cart;

    constructor(protected appData: AppState, protected eventBus: EventEmitter) {  
        this.popup = new Popup(document.querySelector('.modal'), this.eventBus);
        this.cart = new Cart(document.querySelector('.basket'), this.eventBus);

        this.initCatalog();
        this.registerEvents();
    }

    protected initCatalog() {
        this.eventBus.emit('catalog:load');
    }

    protected registerEvents() {
        this.eventBus.on('basket:opened', () => {
            this.popup.content = this.cart.render();
            this.popup.open();
        });
    }
}
