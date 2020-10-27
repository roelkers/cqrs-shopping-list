import React from 'react';
import { useEffect } from 'react'
import { ThemeProvider, createMuiTheme, responsiveFontSizes } from '@material-ui/core/styles'
import AppPage from './AppPage'
import './App.css';
import useProducts from './useProducts';
import useListItems from './useListItems';
import useShoppingLists from './useShoppingLists';

let theme = createMuiTheme({
  palette: {
    primary: {
      main: '#57DBBE',
      light: '#80FFE3'
    },
    secondary: {
      main: '#915540',
      light: '#DF9379'
    }
  },
  typography: {
    fontFamily: 
      `
      Roboto Mono,
      Roboto,
      sans-serif
      `
  }
})
theme = responsiveFontSizes(theme)


function App() {
  const [products, refetchProducts] = useProducts()
  const [shoppingLists ,refetchShoppingLists ] = useShoppingLists()
  useListItems()

  useEffect(() => {
    refetchProducts()
    refetchShoppingLists()
  },[])


  return (
    <ThemeProvider theme={theme}>
      <AppPage />
    </ThemeProvider>
  );
}

export default App;
