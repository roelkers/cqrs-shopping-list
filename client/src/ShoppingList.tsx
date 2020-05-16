import React, { useEffect } from 'react'
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

interface ShoppingListProps extends RouteComponentProps {
  listItems: IShoppingItem[];
  listId: string;
  id?: string
  setListId: (id: string) => void
  checkListItem: (id: string) => void
}

const useStyles = makeStyles((theme) => {
  return ({
    listItemChecked: {
      background: theme.palette.secondary.light!,
      textDecoration: 'line-through'
    },
    listItem: {
      "&:hover, &.Mui-focusVisible": { background: theme.palette.primary.light! }
    }
  })
});

export default function ShoppingList(props: ShoppingListProps) {
  const { listItems,listId,setListId } = props
  const { listItem, listItemChecked } = useStyles()

  useEffect(() => {
    //check if list id from route is the same as current list id,
    //if not then change it to the currently selected
    console.log(props.id)
    if(props.id && props.id !== listId) setListId(props.id)
  },[listId,setListId])

  const handleClick =  (item: IShoppingItem) => {
    props.checkListItem(item.id)
    const payload = {
      list_id: props.listId,
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
    <Box >
      <Box p={2}>
        <MuiLink align='center' display='block' component={Link} to='edit'>Bearbeiten</MuiLink>
      </Box>
      <List>
        {
          listItems.map((item) => {
            return (
              <ListItem onClick={() => handleClick(item)} key={item.id} className={clsx(listItem, item.checked ? listItemChecked: '')} button>
                <ListItemIcon>
                  <LocalCafeIcon />
                </ListItemIcon>
                <ListItemText primary={item.name} />
              </ListItem>
            )
          })
        }
      </List>
    </Box>
  )
}