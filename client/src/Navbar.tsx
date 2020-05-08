import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Box from '@material-ui/core/Box'
import { navigate } from '@reach/router'

const useStyles = makeStyles((theme) => ({

  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

export default function Navbar() {
  const classes = useStyles()

  return (
    <Box flexGrow={1} >
      <AppBar position="static">
        <Toolbar>
             <IconButton onClick={() => navigate('/menu')} edge="start" className={classes.menuButton} color="inherit" aria-label="menu" >
              <MenuIcon />
             </IconButton>
            <Typography variant="h6" className={classes.title}>
              Einkauf-App 
          </Typography>
            <Button color="inherit">Login</Button>
        </Toolbar>
      </AppBar>
    </Box>
      )
} 