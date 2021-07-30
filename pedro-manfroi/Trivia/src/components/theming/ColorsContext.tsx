/**
 * ColorContext is a React context to share information about the custom theming of the application.
 * It has the options of defining primary and secondary colors. 
 */
import React from 'react';

export type ColorsOptions = {
    primaryColor: string
    secondaryColor: string
}

export type ColorContextProps = { 
    colors: ColorsOptions
    setColors(colors: ColorsOptions): void,
};

export const defaultColorOptions: ColorsOptions = {
     primaryColor: "#E21717",
     secondaryColor: "#11147F",
}

const ColorsContext = React.createContext<ColorContextProps>({
        colors: defaultColorOptions,
        setColors: () => {},
    }
);

 
export default ColorsContext;