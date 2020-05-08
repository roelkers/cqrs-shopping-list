import React, { useEffect } from 'react'
import Box from '@material-ui/core/Box'
import ListItem from '@material-ui/core/ListItem'
import List from '@material-ui/core/List'
import { RouteComponentProps } from "@reach/router"
import ListItemIcon from '@material-ui/core/ListItemIcon'
import AddIcon from '@material-ui/icons/Add'
import ListIcon from '@material-ui/icons/List'
import { ListItemText } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider'
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import StarBorder from '@material-ui/icons/StarBorder';
import Collapse from '@material-ui/core/Collapse';
import { IShoppingList } from './interfaces'
import { getShoppingLists } from './client'
import { Link } from '@reach/router'

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
}));

interface MenuProps extends RouteComponentProps  {
  shoppingLists: IShoppingList[]
}

export default function Menu(props: MenuProps) {

const classes = useStyles();
  const [open, setOpen] = React.useState(true);

  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <Box className={classes.root}>
      <List component="nav" aria-label="main mailbox folders">
        <ListItem button>
          <ListItemIcon>
            <AddIcon />
          </ListItemIcon>
          <ListItemText primary="Neuer Einkaufszettel" />
        </ListItem>
        <ListItem button onClick={handleClick}>
          <ListItemIcon>
            <ListIcon />
          </ListItemIcon>
          <ListItemText primary="Einkaufslisten" />
          {open ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {
            props.shoppingLists.map(list => {
            return (
              <ListItem key={list.id} component={Link} to={`/list/${list.id}`} button className={classes.nested}>
                <ListItemIcon>
                  <StarBorder />
                </ListItemIcon>
                <ListItemText primary={list.id} />
              </ListItem>
              )
            })
          }
          </List>
        </Collapse>
      </List>
      <Divider />
      <List component="nav" aria-label="secondary mailbox folders">
        <ListItem button>
          <ListItemText primary="Löschen" />
        </ListItem>
      </List>
    </Box>
  )
}

