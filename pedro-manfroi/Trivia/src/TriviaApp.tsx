
/**
 * This is the root component of the application.
 * Adds support for custom color theming based on the custom ColorContext.
 * Also, it renders the routes utilized in the app and the components associtated with it.
 */
import React from 'react';
import ColorsContext, { defaultColorOptions } from './components/theming/ColorsContext';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { useTriviaAppStorage } from './hooks/useTriviaAppStorage'
import Routes from './Routes';

export default function TriviaApp() {  
  // Creates an internal colors state and set its default values
  const [colors, setColors] = useTriviaAppStorage('settings', JSON.stringify(defaultColorOptions));  
  const colorValues = {colors, setColors};

  // Creates and initializes the material-ui themes based on what is set the colors values
  function createMuiThemeFromContext() {
    const theme = createMuiTheme({
      palette: {
        primary: {
          main: colors.primaryColor,
        },
        secondary: {
          main: colors.secondaryColor,
        }

      }
    })

    return theme
  }


  return (
    // Binds colorValues to the ColorContext
    <ColorsContext.Provider value={colorValues}> 
      <ThemeProvider theme={createMuiThemeFromContext()}>
        <Routes/>
      </ThemeProvider>
    </ColorsContext.Provider>
  );
}



