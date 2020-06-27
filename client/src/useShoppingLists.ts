import { useRecoilState } from "recoil"
import { shoppingListState } from "./atoms"
import { getShoppingLists } from "./client"
import { useEffect } from "react"
import { IShoppingList } from "./interfaces"

const useShoppingLists : () => [IShoppingList[], () => void ] = () => {
  const [shoppingLists, setShoppingLists] = useRecoilState(shoppingListState) 

  const refetchShoppingLists = () => {
    getShoppingLists()
    .then((res) => setShoppingLists(res.data))
  }

  return [shoppingLists, refetchShoppingLists]
}

export default useShoppingLists