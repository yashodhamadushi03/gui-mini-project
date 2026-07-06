export interface Product {
    id: number;
    title: string;
    price: number;
    thumbnail: string;
    category: string;
    brand?: string;
    description?: string;
}

export interface Category {
    slug: string;
    name: string;
    url: string;
}