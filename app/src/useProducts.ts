import { useRecoilState, useRecoilValue } from "recoil"
import { productsState } from "./atoms"
import { getProducts } from "./client"
import { IProduct, IShoppingItem } from "./interfaces"
import { listItemsState } from "./selectors"


const useProducts : () => [IProduct[], () => void] = () => {
  const listItems = useRecoilValue(listItemsState)
  const [products, setProducts] = useRecoilState(productsState)

  const refetchProducts = () => {
    getProducts()
      .then(res => {
        const newProducts: IProduct[] = res.data
          .map(product => {
            return ({
              id: String(product.id),
              name: product.product_name,
              category: product.category,
              selected: listItems.some(i => i.id === `${product.id}`)
            })
          })
        setProducts(newProducts)
      })
  }

  return [products, refetchProducts]
}  

export default useProducts