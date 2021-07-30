import 'es6-shim';
import 'flexboxgrid';
import 'react-app-polyfill/ie11';
import 'url-search-params-polyfill';
import smoothscroll from 'smoothscroll-polyfill';

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { FocusStyleManager } from '@blueprintjs/core';

import { store, history, actions } from 'store';

import { Application } from './Application';

FocusStyleManager.onlyShowFocusOnTabs();
smoothscroll.polyfill();

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <Application />
    </ConnectedRouter>
  </Provider>,
  document.getElementById('application'),
);

if (window.Cypress) {
  window.actions = actions;
  window.store = store;
}
