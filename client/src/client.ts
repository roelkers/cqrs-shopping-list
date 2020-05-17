import { IApiProduct } from "./interfaces"

const BASE_API = process.env.NODE_ENV === 'production' ? 'https://shopping-list-cqrs.herokuapp.com' : 'http://localhost:5000'

export const postEvent = (event: any) => {
    fetch(`${BASE_API}/events`, {
        method: 'POST',
        body: JSON.stringify(event),
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

export const createEventSource = () => new EventSource(`${BASE_API}/list-data`)

export const getShoppingLists = () => fetch(`${BASE_API}/lists`).then((res)=> res.json())

export const getProducts = () : Promise<{ data: IApiProduct[] }> => fetch(`${BASE_API}/products`).then((res)=> res.json())
