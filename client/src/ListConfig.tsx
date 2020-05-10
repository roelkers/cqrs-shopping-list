import React, { useEffect, useState } from 'react'
import Box from '@material-ui/core/Box'
import { RouteComponentProps, Link } from "@reach/router"
import { IShoppingItem, IProduct } from './interfaces'
import { postEvent, getProducts } from './client'
import ListItem from '@material-ui/core/ListItem'
import MuiLink from '@material-ui/core/Link'
import List from '@material-ui/core/List'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import CheckIcon from '@material-ui/icons/Check'
import ListItemText from '@material-ui/core/ListItemText'
import LocalCafeIcon from '@material-ui/icons/LocalCafe'
import { makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx'

interface MenuProps extends RouteComponentProps {
  listItems: IShoppingItem[],
  listId: number
}

const useStyles = makeStyles((theme) => {
  return ({
    listItemChecked: {
      background: theme.palette.secondary.light!
    },
    listItem: {
      "&:hover, &.Mui-focusVisible": { background: theme.palette.primary.light! }
    }
  })
});

export default function Menu(props: MenuProps) {
  const { listItems } = props
  const [products, setProducts] = useState<IProduct[]>([])
  const { listItem, listItemChecked } = useStyles()

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

  const handleClick = (product: IProduct) => {
    const payload = {
      listId: props.listId,
      productId: product.id,
      type: ''
    }
    if (product.selected) {
      payload.type = 'item_removed'
    } else {
      payload.type = 'item_added'
    }
    return postEvent(payload);
  }

  return (
    <Box>
      <Box p={2}>
        <MuiLink align='center' display='block' component={Link} to={`/list/${props.listId}`}>Fertig</MuiLink>
      </Box>
      <List>
        {
          products.map((product) => {
            return (
              <ListItem onClick={() => handleClick(product)} className={clsx(listItem, product.selected ? listItemChecked: '')} key={product.id} button>
                <ListItemIcon>
                  <LocalCafeIcon />
                </ListItemIcon>
                <ListItemText primary={product.name} />{product.selected && <CheckIcon />}
              </ListItem>
            )
          })
        }
      </List>
    </Box>
  )
}

