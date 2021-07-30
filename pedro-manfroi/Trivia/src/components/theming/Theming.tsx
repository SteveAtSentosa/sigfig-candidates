/**
 * Utility component that displays theme related settings.
 * This component uses React.context for Color theming (ColorContext.tsx) settings.
 * 
 */
import React, { FC, useState, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { ChromePicker, ColorResult } from 'react-color';
import ColorsContext, { defaultColorOptions } from './ColorsContext';
import Link from '@material-ui/core/Link';
import Box from '@material-ui/core/Box';
import { Link as RouterLink} from 'react-router-dom'

export const Theming: FC = () => {
    const classes = useStyles();
    const [displayColorPicker1, setDisplayColorPicker1] = useState<boolean>(false); 
    const [displayColorPicker2, setDisplayColorPicker2] = useState<boolean>(false); 
    // colors and setColors function are shared with the ColorContext
    const { colors, setColors } = useContext(ColorsContext);

    const handleChangeColor = (colorOption: "primaryColor" | "secondaryColor") => (color: ColorResult) => {
        // Whenever the user changed the colors options, it will call setColors to update the ColorContext data
        setColors({
            ...colors,
            [colorOption]: color.hex
        })
    }

    const reset = () => {
        // Reset colors to the default options
        setColors(defaultColorOptions);
    }


    return (
        <div>
             <Box p={3}>
                <Box component="div" display="inline" p={1} m={1}>
                    <Button variant="contained" color="primary" onClick={() => setDisplayColorPicker1(true)}>Change primary color</Button>
                    {displayColorPicker1 &&
                    <div className={classes.popover}>
                        <div className={classes.cover} onClick={() => setDisplayColorPicker1(false)}>
                            <ChromePicker color={colors.primaryColor} onChangeComplete={handleChangeColor("primaryColor")}/> 
                        </div>
                    </div>
                    }        
                </Box>
                <Box component="div" display="inline" p={1} m={1}>
                    <Button variant="contained" color="secondary" onClick={() => setDisplayColorPicker2(true)}>Change secondary color</Button>
                    {displayColorPicker2 &&
                    <div className={classes.popover}>
                        <div className={classes.cover} onClick={() => setDisplayColorPicker2(false)}>
                            <ChromePicker color={colors.secondaryColor} onChangeComplete={handleChangeColor("secondaryColor")}/> 
                        </div>
                    </div>
                    }   
                </Box>                            
            </Box>
            <Box p={3}>
                <Box component="div" display="inline" p={1} m={1}>
                    <RouterLink to="/">
                        <Link component="button" variant="body2">Go back to home</Link>
                    </RouterLink>
                </Box>   
                <Box component="div" display="inline" p={1} m={1}>
                    <Button variant="outlined" color="primary" onClick={reset}>Reset to default colors settings</Button>
                </Box>    
            </Box>                
        </div>
    )
}

const useStyles = makeStyles((theme) => ({
    popover: {
        position: 'absolute',
        zIndex: 2,        
    },
    cover: {
      position: 'fixed',
      top: '0px',
      right: '0px',
      bottom: '0px',
      left: '0px',
    },
}));