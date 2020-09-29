import React, { useEffect, useState } from 'react'
import Box from '@material-ui/core/Box'
import { RouteComponentProps, Link } from "@reach/router"
import { IShoppingItem } from './interfaces'
import ListItem from '@material-ui/core/ListItem'
import MuiLink from '@material-ui/core/Link'
import List from '@material-ui/core/List'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import LocalCafeIcon from '@material-ui/icons/LocalCafe'
import { makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx'
import { postEvent } from './client'
import { useRecoilState, useRecoilValue } from 'recoil'
import { listIdState } from './atoms'
import { listItemsState } from './selectors'
import useListItems from './useListItems'
import { CATEGORY_ORDER } from './constants'
import { Button } from '@material-ui/core'

interface ShoppingListProps extends RouteComponentProps {
  id?: string
}

const useStyles = makeStyles((theme) => {
  return ({
    listItemChecked: {
      background: theme.palette.secondary.light!,
      textDecoration: 'line-through'
    },
    list: {
      overflow: 'auto',
      maxHeight: 'calc(100vh - 140px)'
    },
    button: {
      marginTop: 'auto'
    }
  })
});

export default function ShoppingList(props: ShoppingListProps) {
  const [listId, setListId] = useRecoilState(listIdState)
  const listItems = useRecoilValue(listItemsState)
  const { listItemChecked, list, button } = useStyles()
  const checkListItem = useListItems()
  const [displayDoneItems, setDisplayDoneItems] = useState(false)

  useEffect(() => {
    //check if list id from route is the same as current list id,
    //if not then change it to the currently selected
    if (props.id && props.id !== listId) setListId(props.id)
  }, [listId, setListId, props.id])

  const handleClick = (item: IShoppingItem) => {
    checkListItem(item.id)
    const payload = {
      list_id: listId,
      product_id: item.id,
      type: ''
    }
    if (item.checked) {
      payload.type = 'item_unchecked'
    } else {
      payload.type = 'item_checked'
    }
    return postEvent(payload);
  }

  return (
    <Box>
      <Box p={2} >
        <MuiLink align='center' display='block' component={Link} to='edit'>Bearbeiten</MuiLink>
      </Box>
      <List className={list}>
        {
          listItems.slice()
            .filter(item => displayDoneItems ? !item.checked : true)
            .sort((a, b) =>
              CATEGORY_ORDER.indexOf(a.category) - CATEGORY_ORDER.indexOf(b.category)
            )
            .map((item) => {
              return (
                <ListItem onClick={() => handleClick(item)} key={item.id} className={clsx(item.checked ? listItemChecked : '')} >
                  <ListItemIcon>
                    <LocalCafeIcon />
                  </ListItemIcon>
                  <ListItemText primary={item.name} />
                </ListItem>
              )
            })
        }
      </List>
      <Box className={button} display='flex' justifyContent='center'>
        <Button onClick={() => setDisplayDoneItems(!displayDoneItems)}>
          {displayDoneItems ? 'Fertige einblenden' : 'Fertige ausblenden'}
        </Button>
      </Box>
    </Box>
  )
}