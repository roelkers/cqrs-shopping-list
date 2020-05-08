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


interface ShoppingListProps extends RouteComponentProps {
  listItems: IShoppingItem[];
  listId: number;
}

export default function ShoppingList(props: ShoppingListProps) {
  const { listItems } = props

  return (
    <Box width='100%' display='flex' flexDirection='column' justifyContent='center'>
      <MuiLink component={Link} to='edit'>Bearbeiten</MuiLink>
      <List>
        {
          listItems.map((item) => {
            return (
              <ListItem key={item.id} button>
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