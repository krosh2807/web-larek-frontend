export interface Product {
    id: number;
    title: string;
    description: string;
    price: number;
    imageUrl: string;
}

export interface Order {
    id: number;
    userId: number;
    products: Product[];
    totalPrice: number;
}


