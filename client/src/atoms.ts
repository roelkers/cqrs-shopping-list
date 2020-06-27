import { atom } from 'recoil'
import { IProduct, IShoppingList, IShoppingItem } from './interfaces';

export const productsState = atom<IProduct[]>({
  key: 'products', // unique ID (with respect to other atoms/selectors)
  default: [], // default value (aka initial value)
});

export const shoppingListState = atom<IShoppingList[]>({
  key: 'shoppingList', // unique ID (with respect to other atoms/selectors)
  default: [], // default value (aka initial value)
});

export const listIdState = atom<string>({
  key: 'listId', // unique ID (with respect to other atoms/selectors)
  default: '1', // default value (aka initial value)
})

export const listDataState = atom<Map<string,IShoppingItem[]>>({
  key: 'listData', // unique ID (with respect to other atoms/selectors)
  default: new Map(), // default value (aka initial value)
})