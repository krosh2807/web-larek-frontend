export interface User {
    id: number;
    name: string;
    email: string;
    avatarUrl?: string;
}

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
    status: 'pending' | 'shipped' | 'delivered' | 'canceled';
}


