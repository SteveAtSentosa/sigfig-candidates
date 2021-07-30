import thunk from 'redux-thunk';
// eslint-disable-next-line import/no-extraneous-dependencies
import { createBrowserHistory } from 'history';
import { connectRouter, routerMiddleware } from 'connected-react-router';
import { compose, createStore, combineReducers, applyMiddleware } from 'redux';

import { tweakBrowserHistory } from 'utilities/common';

// reducers
import appReducer from './app/app.reducer';
import authReducer from './auth/auth.reducer';
import usersReducer from './users/users.reducer';
import organizationsReducer from './organizations/organizations.reducer';
import reportsReducer from './reports/reports.reducer';
import surveyReducer from './survey/survey.reducer';
import questionsReducer from './questions/questions.reducer';
import attributesReducer from './attributes/attributes.reducer';
import actionsReducer from './actions/actions.reducer';
import chatReducer from './chat/chat.reducer';
import commentsReducer from './comments/comments.reducer';
import oneOnOnesReducer from './oneOnOnes/oneOnOnes.reducer';

// actions
import * as appActions from './app/app.actions';
import * as authActions from './auth/auth.actions';
import * as usersActions from './users/users.actions';
import * as organizationsActions from './organizations/organizations.actions';
import * as reportsActions from './reports/reports.actions';
import * as surveyActions from './survey/survey.actions';
import * as questionsActions from './questions/questions.actions';
import * as attributesActions from './attributes/attributes.actions';
import * as actionsActions from './actions/actions.actions';
import * as chatActions from './chat/chat.actions';
import * as commentsActions from './comments/comments.actions';
import * as oneOnOnesActions from './oneOnOnes/oneOnOnes.actions';

// selectors
import * as authSelectors from './auth/auth.selectors';
import * as usersSelectors from './users/users.selectors';
import * as organizationsSelectors from './organizations/organizations.selectors';
import * as reportsSelectors from './reports/reports.selectors';
import * as surveySelectors from './survey/survey.selectors';
import * as attributesSelectors from './attributes/attributes.selectors';

// helpers
import * as surveyHelpers from './survey/survey.helpers';

const createRootReducer = history => combineReducers({
  router: connectRouter(history),
  app: appReducer,
  auth: authReducer,
  users: usersReducer,
  organizations: organizationsReducer,
  reports: reportsReducer,
  survey: surveyReducer,
  questions: questionsReducer,
  attributes: attributesReducer,
  actions: actionsReducer,
  chat: chatReducer,
  comments: commentsReducer,
  oneOnOnes: oneOnOnesReducer,
});

export const actions = {
  app: appActions,
  auth: authActions,
  users: usersActions,
  organizations: organizationsActions,
  reports: reportsActions,
  survey: surveyActions,
  questions: questionsActions,
  attributes: attributesActions,
  actions: actionsActions,
  chat: chatActions,
  comments: commentsActions,
  oneOnOnes: oneOnOnesActions,
};

export const selectors = {
  auth: authSelectors,
  users: usersSelectors,
  organizations: organizationsSelectors,
  reports: reportsSelectors,
  survey: surveySelectors,
  attributes: attributesSelectors,
};

export const helpers = {
  survey: surveyHelpers,
};

export const history = createBrowserHistory({
  getUserConfirmation: (str, callback) => {
    const { app: { requestConfirmNavigation } } = actions;
    // eslint-disable-next-line no-use-before-define
    store.dispatch(requestConfirmNavigation(callback));
  },
});
const isDevelopmentMode = process.env.NODE_ENV === 'development';

const tweakedHistory = tweakBrowserHistory(history);

export const store = createStore(createRootReducer(tweakedHistory), compose(
  applyMiddleware(routerMiddleware(tweakedHistory), thunk),
  // eslint-disable-next-line no-underscore-dangle
  isDevelopmentMode && window.__REDUX_DEVTOOLS_EXTENSION__ ? window.__REDUX_DEVTOOLS_EXTENSION__() : f => f,
));

store.dispatch(appActions.init());
store.dispatch(authActions.init());
