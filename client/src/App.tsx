import React from 'react';
import { useEffect, useState } from 'react'
import { ThemeProvider, createMuiTheme, responsiveFontSizes } from '@material-ui/core/styles'
import orange from '@material-ui/core/colors/orange'
import green from '@material-ui/core/colors/green'
import AppPage from './AppPage'
import './App.css';
import { createEventSource, getShoppingLists } from './client';
import { IShoppingItem, IShoppingList } from './interfaces';

let theme = createMuiTheme({
  palette: {
    primary: green,
    secondary: orange
  }
})
theme = responsiveFontSizes(theme)


function App() {
  const [listItems, setListItems] = useState<IShoppingItem[]>([]);
  const [listening, setListening] = useState(false);
  const [listId, setListId ] = useState(1)
  const [shoppingLists, setShoppingLists] = React.useState<IShoppingList[]>([])

  useEffect(() => {
    if (!listening) {
      const eventSource = createEventSource(listId) 
      eventSource.onmessage = async (event) => {
        const parsedData = JSON.parse(event.data) as IShoppingItem[];
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
        setListItems(parsedData);
      };
      eventSource.onerror = async (error) => {
        const data = await window.caches.match(`/events/${listId}`)
        const jsonData = await data?.json()
        console.log("using cached data:")
        console.log(jsonData)
        setListItems(jsonData);
      }

      setListening(true);
    }
  }, [listening, listItems]);

  useEffect(() => {
    getShoppingLists()
    .then((res) => setShoppingLists(res.data))
  },[])

  const checkListItem = (id: string) => {
    const newItems = listItems.map(item => item.id === id ? ({ ...item, checked: !item.checked }) : item)
    setListItems(newItems)
  }

  return (
    <ThemeProvider theme={theme}>
      <AppPage shoppingLists={shoppingLists} listId={listId} setListId={setListId} listItems={listItems} checkListItem={checkListItem} />
    </ThemeProvider>
  );
}

export default App;
