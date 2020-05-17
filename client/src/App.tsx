import React from 'react';
import { useEffect, useState } from 'react'
import { ThemeProvider, createMuiTheme, responsiveFontSizes } from '@material-ui/core/styles'
import orange from '@material-ui/core/colors/orange'
import green from '@material-ui/core/colors/green'
import AppPage from './AppPage'
import './App.css';
import { createEventSource, getShoppingLists, getProducts } from './client';
import { IShoppingItem, IShoppingList, IProduct } from './interfaces';

let theme = createMuiTheme({
  palette: {
    primary: green,
    secondary: orange
  }
})
theme = responsiveFontSizes(theme)


function App() {
  const [listData, setListItems] = useState<Map<string,IShoppingItem[]>>(new Map());
  const [listening, setListening] = useState(false);
  const [listId, setListId ] = useState('1')
  const [shoppingLists, setShoppingLists] = React.useState<IShoppingList[]>([])
  const [products, setProducts] = useState<IProduct[]>([])

  useEffect(() => {
    if (!listening) {
      const eventSource = createEventSource() 
      eventSource.onmessage = async (event) => {
        const parsedData = JSON.parse(event.data) as any
        console.log("message arrived")
        console.log(parsedData)
        const jsonResponse = new Response(event.data, {
          headers: {
            'content-type': 'application/json'
          }
        })
        const cache = await window.caches.open('shoppinglist')
        await cache.put(`/events/${listId}`, jsonResponse ).catch(e => console.log(e))
        console.log("added to cache !")
        const map = new Map(Object.entries(parsedData))
        setListItems(map);
      };
      eventSource.onerror = async (error) => {
        const data = await window.caches.match(`/events/${listId}`)
        const jsonData = await data?.json()
        console.log("using cached data:")
        console.log(jsonData)
        const map = new Map(Object.entries(jsonData))
        setListItems(map);
      }
      
      setListening(true);
    }
  }, [listening, listData]);

  const listItems = listData.get(listId) || [] as IShoppingItem[]

  useEffect(() => {
    getShoppingLists()
    .then((res) => setShoppingLists(res.data))
  },[])

  useEffect(() => {
    getProducts().
    then(res => {
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
  },[])

  useEffect(() => {
    const newProducts: IProduct[] = products 
    .map(product => {
      return ({
        id: String(product.id),
        name: product.name,
        category: product.category,
        selected: listItems.some(i => i.id === `${product.id}`)
      })
    })
    setProducts(newProducts)     
  },[listItems])

  const checkListItem = (id: string) => {
    const newItems = listItems.map(item => item.id === id ? ({ ...item, checked: !item.checked }) : item)
    const updatedMap = listData.set(listId,newItems) 
    setListItems(updatedMap)
  }

  return (
    <ThemeProvider theme={theme}>
      <AppPage products={products} shoppingLists={shoppingLists} listId={listId} setListId={setListId} listItems={listItems} checkListItem={checkListItem} />
    </ThemeProvider>
  );
}

export default App;
