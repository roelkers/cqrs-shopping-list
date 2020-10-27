import { IApiProduct } from "./interfaces"

const BASE_API = process.env.REACT_APP_BASE_URL

export const postEvent = (event: any) => {
    return fetch(`${BASE_API}/events`, {
        method: 'POST',
        body: JSON.stringify(event),
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

export const createEventSource = () => new EventSource(`${BASE_API}/list-data`)

export const getShoppingLists = () => fetch(`${BASE_API}/lists`).then((res) => res.json())

export const getProducts = (): Promise<{ data: IApiProduct[] }> => fetch(`${BASE_API}/products`).then((res) => res.json())

export const postNewProduct = ({ newProductName , newProductCategory } : { newProductName: string, newProductCategory: string }) => fetch(`${BASE_API}/products`,
    {
        method: 'POST',
        body : JSON.stringify({
            name: newProductName,
            category: newProductCategory
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    })