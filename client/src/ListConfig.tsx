import React, { useState } from 'react'
import Box from '@material-ui/core/Box'
import { RouteComponentProps, Link } from "@reach/router"
import { IShoppingItem, IProduct } from './interfaces'
import { postEvent } from './client'
import ListItem from '@material-ui/core/ListItem'
import MuiLink from '@material-ui/core/Link'
import List from '@material-ui/core/List'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import CheckIcon from '@material-ui/icons/Check'
import ListItemText from '@material-ui/core/ListItemText'
import LocalCafeIcon from '@material-ui/icons/LocalCafe'
import Chip from '@material-ui/core/Chip'
import { makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx'

interface MenuProps extends RouteComponentProps {
  listItems: IShoppingItem[],
  listId: string,
  products: IProduct[]
}

const useStyles = makeStyles((theme) => {
  return ({
    listItemChecked: {
      background: theme.palette.secondary.light!
    },
    listItem: {
      "&:hover, &.Mui-focusVisible": { background: theme.palette.primary.light! }
    },
    chipContainer: {
      overflowX: 'auto',
    },
    list: {
      overflow: 'auto',
      maxHeight: 'calc(100vh - 135px)'
    }
  })
});

export default function Menu(props: MenuProps) {
  const { listItems, products } = props
  const { listItem, listItemChecked, chipContainer, list } = useStyles()
  const [activeCategories, setCategories] = useState<string[]>([])

  const handleClick = (product: IProduct) => {
    const payload = {
      list_id: props.listId,
      product_id: product.id,
      type: ''
    }
    if (product.selected) {
      payload.type = 'item_removed'
    } else {
      payload.type = 'item_added'
    }
    return postEvent(payload);
  }

  const handleCategoryClick = (category: string) => {
    console.log(category)
    const updatedCategories = activeCategories.includes(category) ? activeCategories.filter(c => c !== category) : [...activeCategories, category]
    console.log(updatedCategories)
    return setCategories(updatedCategories)
  }
  const categories = Array.from(new Set(products.map(p => p.category)))

  return (
    <Box>
      <Box p={2}>
        <MuiLink align='center' display='block' component={Link} to={`/list/${props.listId}`}>Fertig</MuiLink>
      </Box>
      <Box p={1} display='flex' justifyContent='flex-start' className={chipContainer}>
        {categories.map(category =>
          <Chip key={category}
            icon={<LocalCafeIcon />}
            label={category}
            color={activeCategories.includes(category) ? 'primary' : 'default'}
            onClick={() => handleCategoryClick(category)}
            clickable
          />
        )}
      </Box>
      <List className={list}>
        {
          products
            .filter((product: IProduct) => activeCategories.length > 0 ? activeCategories.includes(product.category) : true)
            .map((product: IProduct) => {
              const selected = listItems.some(item => item.id === product.id)
              return (
                <ListItem onClick={() => handleClick(product)} className={clsx(listItem, selected ? listItemChecked : '')} key={product.id} button>
                  <ListItemIcon>
                    <LocalCafeIcon />
                  </ListItemIcon>
                  <ListItemText primary={product.name} />{selected && <CheckIcon />}
                </ListItem>
              )
            })
        }
      </List>
    </Box>
  )
}

