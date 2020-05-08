import React, { useEffect, useState } from 'react'
import Box from '@material-ui/core/Box'
import { RouteComponentProps, Link } from "@reach/router"
import { IShoppingItem, IProduct } from './interfaces'
import { postEvent, getProducts } from './client'
import ListItem from '@material-ui/core/ListItem'
import MuiLink from '@material-ui/core/Link'
import List from '@material-ui/core/List'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import LocalCafeIcon from '@material-ui/icons/LocalCafe'

interface MenuProps extends RouteComponentProps {
  listItems: IShoppingItem[],
  listId: number
}

const sendEvent = () => {
  const payload = JSON.stringify({
    productId: Math.floor(Math.random() * 1000),
    listId: 1,
    type: 'item_added'
  })
  return postEvent(payload)
}

export default function Menu(props: MenuProps) {
  const { listItems } = props
  const [products, setProducts] = useState<IProduct[]>([])
  useEffect(() => {
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
  }, [listItems])
  
  return (
    <Box>
      <MuiLink component={Link} to={`/list/${props.listId}`}>Fertig</MuiLink>
      <List>
        {
          products.map((product) => {
            return (
              <ListItem key={product.id} button>
                <ListItemIcon>
                  <LocalCafeIcon />
                </ListItemIcon>
                <ListItemText primary={product.id} />{product.selected && 'jey'}
              </ListItem>
            )
          })
        }
      </List>
    </Box>
  )
}

