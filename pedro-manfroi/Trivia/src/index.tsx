/**
 * Entry point of the application.
 * Configure the Redux Provider and adds an Error Boundary to catch errors thrown by the application that are not handled.
 */
import React from 'react';
import ReactDOM from 'react-dom';
import TriviaApp from './TriviaApp';
import TriviaAppErrorBoundary from './TriviaAppErrorBoundary';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import reducers from './reducers';

// Creates the Redux store
const store = createStore(reducers);

ReactDOM.render(
  <React.StrictMode>    
      <TriviaAppErrorBoundary>
        <Provider store={store}>
          <TriviaApp />
        </Provider>
      </TriviaAppErrorBoundary> 
  </React.StrictMode>,
  document.getElementById('root')
);