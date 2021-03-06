import React, { useState } from 'react'
import Box from '@material-ui/core/Box'
import { RouteComponentProps, Link } from "@reach/router"
import { IProduct } from './interfaces'
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
import { useRecoilValue } from 'recoil'
import { productsState, listIdState } from './atoms'
import { listItemsState } from './selectors'
import { Swipeable } from 'react-swipeable'
import { CATEGORY_ORDER } from './constants'

interface ListConfigProps extends RouteComponentProps { }

const useStyles = makeStyles((theme) => {
  return ({
    listItemChecked: {
      background: theme.palette.secondary.light!
    },
    chipContainer: {
      height: '68px',
      overflowX: 'scroll',
    },
    list: {
      overflow: 'auto',
      maxHeight: 'calc(100vh - 185px)'
    },
    listItemText: {
      display: 'flex',
      '& .MuiListItemText-secondary': {
        marginLeft: '1em'
      }
    }
  })
});


export default function ListConfig(props: ListConfigProps) {
  const { listItemChecked, chipContainer, list , listItemText } = useStyles()
  const [activeCategories, setCategories] = useState<string[]>([])
  const products = useRecoilValue(productsState)
  const listItems = useRecoilValue(listItemsState)
  const listId = useRecoilValue(listIdState)

  // const handleClick = (product: IProduct) => {
  //   const payload = {
  //     list_id: listId,
  //     product_id: product.id,
  //     type: ''
  //   }
  //   const selected = listItems.some(item => item.id === product.id)
  //   if (selected) {
  //     payload.type = 'item_removed'
  //   } else {
  //     payload.type = 'item_added'
  //   }
  //   return postEvent(payload);
  // }

  const increaseQuantity = (product: IProduct) => {
    const item = listItems.find(item => item.id === product.id)
    if (!item) {
      return postEvent({
        list_id: listId,
        product_id: product.id,
        type: 'item_added'
      })
    }
    return postEvent({
      list_id: listId,
      product_id: product.id,
      type: 'quantity_inc'
    })
  }

  const decreaseQuantity = (product: IProduct) => {
    const item = listItems.find(item => item.id === product.id)
    if (item?.quantity! == 1) {
      return postEvent({
        list_id: listId,
        product_id: product.id,
        type: 'item_removed'
      })
    }
    if (item?.quantity! > 1) {
      return postEvent({
        list_id: listId,
        product_id: product.id,
        type: 'quantity_dec'
      })
    }
  }

  const handleCategoryClick = (category: string) => {
    const updatedCategories = activeCategories.includes(category) ? activeCategories.filter(c => c !== category) : [category]
    return setCategories(updatedCategories)
  }
  const categories = Array.from(new Set(products.map(p => p.category)))

  return (
    <Box>
      <Box p={2}>
        <MuiLink align='center' display='block' component={Link} to={`/list/${listId}`}>Fertig</MuiLink>
      </Box>
      <Box p={1} display='flex' justifyContent='space-between' alignItems='space-between' flexDirection='column' flexWrap='wrap' className={chipContainer}>
        {categories
          .sort((a, b) =>
            CATEGORY_ORDER.indexOf(a) - CATEGORY_ORDER.indexOf(b)
          )
          .map(category =>
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
            .sort((a, b) =>
              CATEGORY_ORDER.indexOf(a.category) - CATEGORY_ORDER.indexOf(b.category)
            )
            .map((product: IProduct) => {
              const selected = listItems.some(item => item.id === product.id)
              const quantity = listItems.find(item => item.id === product.id)?.quantity
              return (
              <Swipeable
                onSwipedLeft={() =>  decreaseQuantity(product)}
                onSwipedRight={() => increaseQuantity(product)}
                trackMouse
              >
                <ListItem
                  button
                  // classes={{
                  //   focusVisible: selected ? listItemChecked : ''
                  // }}
                  focusVisibleClassName={selected ? listItemChecked : ''}
                  className={clsx(selected ? listItemChecked : '')}
                  key={product.id}
                >
                  <ListItemIcon>
                    <LocalCafeIcon />
                  </ListItemIcon>
                  <ListItemText className={listItemText} primary={product.name} secondary={selected ? quantity : ''} />{selected && <CheckIcon />}
                </ListItem>
                </Swipeable>
              )
            })
        }
      </List>
    </Box>
  )
}

