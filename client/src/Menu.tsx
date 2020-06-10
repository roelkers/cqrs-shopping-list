import React from 'react'
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
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { IShoppingList } from './interfaces'
import { Link } from '@reach/router'
import { postEvent } from './client'

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
  isDeleted: {
    backgroundColor: theme.palette.secondary.dark,
  }
}));

interface MenuProps extends RouteComponentProps {
  shoppingLists: IShoppingList[],
}

export default function Menu(props: MenuProps) {

  const classes = useStyles();
  const [open, setOpen] = React.useState(true);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [newListTitle, setNewListTitle] = React.useState('')
  const [listToDelete, selectListToDelete] = React.useState('')

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleDeleteOpen = () => {
    setDeleteOpen(true);
  };

  const handleDeleteClose = () => {
    setDeleteOpen(false);
  };

  const handleClick = () => {
    setOpen(!open);
  };

  const handleNewList = () => {
    handleDialogClose()
    if (!newListTitle.trim()) return;
    setNewListTitle('')
    const payload = {
      type: 'list_added',
      name: newListTitle,
    }
    return postEvent(payload);
  }

  const handleListDelete = () => {
    handleDialogClose()
    if (!listToDelete.trim()) return;
    selectListToDelete('')
    const payload = {
      type: 'list_removed',
      list_id: listToDelete
    }
    return postEvent(payload);
  }

  return (
    <Box className={classes.root}>
      <List component="nav" aria-label="main mailbox folders">
        <ListItem button>
          <ListItemIcon>
            <AddIcon />
          </ListItemIcon>
          <ListItemText onClick={handleDialogOpen} primary="Neuer Einkaufszettel" />
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
                    <ListItemText primary={list.name} />
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
          <ListItemText onClick={handleDeleteOpen} primary="Löschen" />
        </ListItem>
      </List>
      <Dialog open={dialogOpen} onClose={handleDialogClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Neue Liste</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bitte gib den Namen deiner Einkaufsliste ein.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            value={newListTitle}
            label="Name"
            type="name"
            fullWidth
            onChange={(event) => setNewListTitle(event.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Zurück
          </Button>
          <Button onClick={handleNewList} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={deleteOpen} onClose={handleDeleteClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Liste löschen</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Welche Liste möchtest du löschen?
          </DialogContentText>
          <List>
            {props.shoppingLists.map(list => {
              const isDeleted = listToDelete === list.id
              return (
                <ListItem key={list.id} onClick={() => selectListToDelete(list.id)} button className={isDeleted ? classes.isDeleted : ''}>
                  <ListItemIcon>
                    <StarBorder />
                  </ListItemIcon>
                  <ListItemText primary={list.name} />
                </ListItem>
              )
            })
            }
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteClose} color="primary">
            Zurück
          </Button>
          <Button onClick={handleListDelete} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

