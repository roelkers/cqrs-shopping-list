export interface IShoppingItem {
    id: string;
    name: string;
}

export interface IShoppingList {
    id: string;
}

export interface IApiProduct {
    id: number;
    product_name: string;
    category: string;
    name: string;
}

export interface IProduct {
    id: string;
    category: string;
    name: string;
    selected: boolean;
}