import React from 'react'
import { Router } from '@reach/router'
import ShoppingList from './ShoppingList'
import ListConfig from './ListConfig'
import Menu from './Menu'
import Navbar from './Navbar'
import { IShoppingItem, IShoppingList } from './interfaces'

interface AppPageProps {
    listItems: IShoppingItem[],
    listId: number,
    setListId: any,
    shoppingLists: IShoppingList[]
}

export default function AppPage (props: AppPageProps) {
    return (
        <>
          <Navbar />
          <Router >
              <ShoppingList listId={props.listId} listItems={props.listItems} path="/list/:id" />
              <ListConfig  listId={props.listId} listItems={props.listItems} path="/list/:id/edit" />
              <Menu shoppingLists={props.shoppingLists} path="/menu" />
          </Router>
        </>
    )
}