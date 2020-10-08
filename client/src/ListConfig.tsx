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
    listItem: {
      '&:active': {
        'backgroundColor': 'none'   
      }
    },
    listItemText: {
      display: 'flex',
      '& .MuiListItemText-secondary': {
        marginLeft: '1em'
      }
    }
  })
});

const SWIPE_THRESHOLD = 30

export default function ListConfig(props: ListConfigProps) {
  const { listItemChecked, chipContainer, list , listItem, listItemText } = useStyles()
  const [activeCategories, setCategories] = useState<string[]>([])
  const products = useRecoilValue(productsState)
  const listItems = useRecoilValue(listItemsState)
  const listId = useRecoilValue(listIdState)
  const [swipeTravelStart, setSwipeTravelStart] = useState(0)

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
  const handleTouchMove = (product: IProduct) => (e: React.TouchEvent<HTMLDivElement>) => {
  }
  const handleTouchStart = (product: IProduct) => (e: React.TouchEvent<HTMLDivElement>) => {
    setSwipeTravelStart(e.changedTouches[0].clientX)
  }
  const handleTouchEnd = (product: IProduct) => (e: React.TouchEvent<HTMLDivElement>) => {
    if (swipeTravelStart - e.changedTouches[0].clientX > SWIPE_THRESHOLD) {
      decreaseQuantity(product)
    }
    if (swipeTravelStart - e.changedTouches[0].clientX < - SWIPE_THRESHOLD) {
      increaseQuantity(product)
    }
  }
  const handleMouseMove = (product: IProduct) => (e: React.MouseEvent<HTMLDivElement>) => {
  }
  const handleMouseDown = (product: IProduct) => (e: React.MouseEvent<HTMLDivElement>) => {
    setSwipeTravelStart(e.clientX)
  }
  const handleMouseUp = (product: IProduct) => (e: React.MouseEvent<HTMLDivElement>) => {
    if (swipeTravelStart - e.clientX > SWIPE_THRESHOLD) {
      decreaseQuantity(product)
    }
    if (swipeTravelStart - e.clientX < - SWIPE_THRESHOLD) {
      increaseQuantity(product)
    }
  }
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
                <ListItem
                  button
                  // classes={{
                  //   focusVisible: selected ? listItemChecked : ''
                  // }}
                  focusVisibleClassName={selected ? listItemChecked : ''}
                  className={clsx(selected ? listItemChecked : '')}
                  key={product.id}
                  onTouchStart={handleTouchStart(product)}
                  onTouchMove={handleTouchMove(product)}
                  onTouchEnd={handleTouchEnd(product)}
                  onMouseDown={handleMouseDown(product)}
                  onMouseMove={handleMouseMove(product)}
                  onMouseUp={handleMouseUp(product)}
                >
                  <ListItemIcon>
                    <LocalCafeIcon />
                  </ListItemIcon>
                  <ListItemText className={listItemText} primary={product.name} secondary={selected ? quantity : ''} />{selected && <CheckIcon />}
                </ListItem>
              )
            })
        }
      </List>
    </Box>
  )
}

