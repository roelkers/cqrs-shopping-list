import React from 'react'
import { Router } from '@reach/router'
import ShoppingList from './ShoppingList'
import ListConfig from './ListConfig'
import Menu from './Menu'
import Navbar from './Navbar'
import { IShoppingItem, IShoppingList, IProduct } from './interfaces'
import Box from '@material-ui/core/Box'
import { makeStyles } from '@material-ui/core'

interface AppPageProps {
    listItems: IShoppingItem[],
    products: IProduct[],
    listId: string,
    setListId: (id: string) => void,
    shoppingLists: IShoppingList[],
    checkListItem: (id: string) => void
}

const useStyles = makeStyles(() => ({
    page: {
        margin: '0',
        padding: '0',
        maxHeight: '100vh',
        overflow: 'hidden',
        position: 'relative'
    }
}))

export default function AppPage(props: AppPageProps) {
    const { page } = useStyles()
    return (
        <Box className={page}>
            <Navbar />
            <Router >
                <ShoppingList listId={props.listId} listItems={props.listItems} checkListItem={props.checkListItem} setListId={props.setListId} path="/list/:id" />
                <ListConfig products={props.products} listId={props.listId} listItems={props.listItems} path="/list/:id/edit" />
                <Menu shoppingLists={props.shoppingLists} path="/menu" />
            </Router>
        </Box>
    )
}