import React from 'react'
import { Router } from '@reach/router'
import ShoppingList from './ShoppingList'
import ListConfig from './ListConfig'
import Menu from './Menu'
import Navbar from './Navbar'
import { IShoppingItem, IShoppingList, IProduct } from './interfaces'
import Box from '@material-ui/core/Box'
import { makeStyles } from '@material-ui/core'

interface AppPageProps { }

const useStyles = makeStyles(() => ({
    page: {
        boxSizing: 'border-box',
        margin: '0',
        padding: '0',
        maxHeight: '100vh',
        position: 'relative',
        paddingBottom: '10vh'
    }
}))

export default function AppPage(props: AppPageProps) {
    const { page } = useStyles()
    return (
        <Box className={page}>
            <Navbar />
            <Router >
                <ShoppingList path="/list/:id" />
                <ListConfig path="/list/:id/edit" />
                <Menu  path="/menu" />
            </Router>
        </Box>
    )
}