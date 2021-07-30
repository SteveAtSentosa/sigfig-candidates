/**
 * This is a demonstration of creating a new custom hook.
 * It enables persisting data related with Trivia app (i.e: settings). 
 * Warning: For the sake of simplicity, the default storage mechanism is the browser local storage.
 * If the user clears the local storage or is opens in browser anonymous mode (like Chrome's Incognito, Safari's Private Window, Edge's InPrivate...)
 * any saved changes will be lost.
 */

import { useState } from 'react';

/**
 * Custom hooks that acts as a interface for the App specific storage system.
 * Internally it uses a internal state with useState hook and enhances it to provide a way to persist the data.
 * @param key key that represents a unique id of what's going to be saved (acts like a key-value Map)
 * @param defaultValue initial value that are going to be utilized if no data is present in the storage.
 */
export function useTriviaAppStorage(key: string, defaultValue: string) {
    // Create a internal state and sync with data data that's already in local storage or initialize it.
    const [storedValue, setStoredValue] = useState(() => {
      try {
        // Check if already exists data in the browser localStorage
        const item = window.localStorage.getItem(key);        
        return item ? JSON.parse(item) : JSON.parse(defaultValue);
      } catch (error) {
        // Throws and Error (this should be caught by the application Error boundary).
        throw new Error(`Error retrieving information from localStorage ${error.toString()}`);        
      }
    });
  
    // Wraps it in a way that it will have the same method signature as useState
    const setValue = (value: Function | string) => {
      try {
        // If value is a Function type, will utilize the same pattern as useState
        const valueToStore = value instanceof Function ? value(storedValue) : value;          
        // Save state
        setStoredValue(valueToStore);          
        // Save to local storage
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      } catch (error) {
        // Throws and Error (this should be caught by the application Error boundary).
        throw new Error(`Error retrieving information from localStorage ${error.toString()}`);      
      }
    };
  
    return [storedValue, setValue];
  }