/**
 * Custom error boundary for the Trivia App.
 * Will log the error in console and display a message to the user.
 */
import React, { Component, ErrorInfo } from 'react';

export interface State {
    hasError: boolean
}

export default class TriviaAppErrorBoundary extends Component<{}, State> {

    state = { hasError: false };

    static getDerivedStateFromError(error: Error) {
        return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        // Something went wrong, logs the error.
        console.log(`An unexpected error has happened: ${errorInfo}`, error);
    }

    render() {
        // Display an error message to the user when an error occurs.
        if (this.state.hasError) {
          return <h1>Something went wrong! Please refresh the page and try again.</h1>;
        }
    
        return this.props.children; 
      }
}