import { selector } from 'recoil' 
import { listIdState, listDataState } from './atoms'
import { IShoppingItem } from './interfaces';

export const listItemsState = selector<IShoppingItem[]>({
  key: 'listItems', 
  get: ({get} : any) => {
    const id = get(listIdState);
    const listData = get(listDataState) 

    const items = listData.get(id) || [] as IShoppingItem[]
    return items;
  },
});