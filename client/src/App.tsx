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
      eventSource.onmessage = (event) => {
        const parsedData = JSON.parse(event.data) as IShoppingItem[];
        console.log("message arrived")
        console.log(parsedData)
        setListItems(parsedData);
      };

      setListening(true);
    }
  }, [listening, listItems]);

  useEffect(() => {
    getShoppingLists()
    .then((res) => setShoppingLists(res.data))
  },[])

  return (
    <ThemeProvider theme={theme}>
      <AppPage shoppingLists={shoppingLists} listId={listId} setListId={setListId} listItems={listItems} />
    </ThemeProvider>
  );
}

export default App;
