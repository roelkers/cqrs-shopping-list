import React from 'react'
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
  listId: number;
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
  const { listItems } = props
  const { listItem, listItemChecked } = useStyles()

  const handleClick =  (item: IShoppingItem) => {
    const payload = {
      listId: props.listId,
      productId: item.id,
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
                <ListItemText primary={item.id} />
              </ListItem>
            )
          })
        }
      </List>
    </Box>
  )
}