import shortid from 'shortid';
import { createReducer } from 'redux-act';

import { getScreenSize } from 'utilities/common';

import * as actions from './app.actions';
import * as reportActions from '../reports/reports.actions';

const initialState = {
  language: 'en',
  notifications: [],
  mainMenuVisible: false,
  preventNavigation: false,
  preventNavigationConfirmShow: false,
  preventNavigationCallback: null,
  screenSize: getScreenSize(window.innerWidth),
  selectedOrganizationID: null,

  settings: {
    selectedTabID: '',
    selectedOrganizationID: null,
    segmentReportSelectedSegment: null,
  },
};

const reducer = {
  [actions.setSelectedOrganizationID]: (state, selectedOrganizationID) => ({
    ...state,
    selectedOrganizationID,
  }),

  [actions.setLanguage]: (state, language) => ({
    ...state,
    language,
  }),

  [actions.toggleMainMenu]: state => ({
    ...state,
    mainMenuVisible: !state.mainMenuVisible,
  }),

  [actions.setScreenSize]: (state, screenSize) => ({
    ...state,
    screenSize,
  }),

  [actions.showNotification]: (state, notification) => {
    const notificationWithID = {
      ...notification,
      id: shortid.generate(),
    };

    return {
      ...state,
      notifications: [...state.notifications, notificationWithID],
    };
  },

  [actions.dismissNotification]: (state, notificationToDismiss) => ({
    ...state,
    notifications: state.notifications.filter(notification => (
      notification.id !== notificationToDismiss.id
    )),
  }),

  [actions.setPreventNavigation]: (state, preventNavigation) => ({
    ...state,
    preventNavigation,
  }),

  [actions.setConfirmNavigation]: (state, preventNavigationCallback) => ({
    ...state,
    preventNavigationConfirmShow: !!preventNavigationCallback,
    preventNavigationCallback,
  }),

  [actions.selectSettingsTab]: (state, settingsTabID) => ({
    ...state,
    settings: {
      ...state.settings,
      selectedTabID: settingsTabID,
    },
  }),

  [reportActions.segmentReportSelectSegment]: (state, segment) => ({
    ...state,
    settings: {
      ...state.settings,
      segmentReportSelectedSegment: segment,
    },
  }),
};

export default createReducer(reducer, initialState);
