/**
 * This is a function component that represents the Home page of the app.
 * It utilizes the makeStyles utility to inject custom CSS directly in JavaScript (CSS-in-JS).
 */

import React, { FC } from 'react';
import { Link } from 'react-router-dom';
import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import SettingsIcon from '@material-ui/icons/Settings';
import PaletteIcon from '@material-ui/icons/Palette';

export const Home: FC = () => {
    const classes = useStyles();
    return (        
        <Container component="main" maxWidth="xs">               
            <Link to="/settings">
                <Button color="secondary" startIcon={<SettingsIcon/>}>Settings</Button>
            </Link>
            <Link to="/theming">
                <Button color="secondary" startIcon={<PaletteIcon/>}>Theming</Button>
            </Link>            
            <div className={classes.paper}>
                <Typography variant="h5" align="center">Welcome to the Trivia Challenge!</Typography>
                <Box p={6}>
                    <Typography variant="subtitle1" align="center">You will be presented with 10 True or False questions.</Typography>
                </Box>
                <Box p={4}>
                    <Typography variant="body1" align="center">Can you score 100%?</Typography>
                </Box>
                <Box p={2}>
                    <Link to="/quiz">
                        <Button fullWidth variant="contained" color="primary">BEGIN</Button>
                    </Link>
                </Box>                    
            </div>                
        </Container>
    )
}


const useStyles = makeStyles((theme) => ({
    paper: {
      marginTop: theme.spacing(10),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      paddingBottom: 10,
    },
}));