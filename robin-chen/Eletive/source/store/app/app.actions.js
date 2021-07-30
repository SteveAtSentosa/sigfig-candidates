/* eslint no-use-before-define: 0 */
/* global CONFIG */
import moment from 'moment';
import { createAction } from 'redux-act';
import { push } from 'connected-react-router';
import { I18n } from 'react-i18nify';

import cache from 'api/cache';
import client from 'api/client';
import { actions, selectors } from 'store';
import { Routes, Demo } from 'Constants';

export const init = () => (dispatch) => {
  dispatch(selectOrganizationID());
  dispatch(loadLanguage());
};

export const setLocale = locale => () => {
  I18n.setLocale(locale);
  moment.locale(locale);
};

export const updateDocumentLanguage = language => () => {
  document.documentElement.setAttribute('lang', language);
};

export const fetchLanguagePack = language => () => (
  // NOTE:
  // default value for language is needed here anyway when
  // running tests in watch mode. For some reason module name mapper
  // doesn't resolve language value here and instead see `/${language}`
  import(`Constants/translation/Common.Locales/${language || 'en'}`)
    .catch(() => ({
      translations: {},
    }))
);

I18n.setHandleMissingTranslation((key) => {
  if (CONFIG.stage !== 'prod') {
    // eslint-disable-next-line no-console
    console.error(`Missing translation: ${key}`);
  }
  const keyParts = key.split('.');
  return keyParts[keyParts.length - 1];
});

export const loadLanguage = () => async (dispatch) => {
  let language = window.localStorage.getItem('language') || 'en';

  const currentUser = client.getCurrentUser();
  if (currentUser) {
    const { language: currentUserLanguage } = currentUser;
    language = currentUserLanguage;
  }

  const { translations } = await dispatch(fetchLanguagePack(language));
  I18n.setTranslations({
    [language]: translations,
  });

  dispatch(setLocale(language));
  dispatch(setLanguage(language));
  dispatch(updateDocumentLanguage(language));
};

export const updateLanguage = language => async (dispatch, getState) => {
  window.localStorage.setItem('language', language);

  cache.reset();

  client.updateUser(language);

  const { translations } = await dispatch(fetchLanguagePack(language));
  I18n.setTranslations({
    [language]: translations,
  });

  dispatch(setLocale(language));
  dispatch(setLanguage(language));
  dispatch(updateDocumentLanguage(language));

  const { auth: { currentUser } } = getState();
  const currentUserWithUpdatedLanguage = {
    ...currentUser,
    language,
  };

  dispatch(actions.auth.updateCurrentUser.success(currentUserWithUpdatedLanguage));
  client.setUserData(currentUserWithUpdatedLanguage);
};

export const onScreenResize = size => (dispatch) => {
  dispatch(setScreenSize(size));
};

export const switchDemoMode = () => (dispatch, getState) => {
  const { app: { selectedOrganizationID } } = getState();

  // dispatch(actions.reports.segmentReportSelectSegment({}));

  if (selectedOrganizationID === Demo.demoOrganization.id) {
    dispatch(selectOwnOrganizationID());
  } else {
    dispatch(selectOrganizationID(Demo.demoOrganization.id));
  }

  dispatch(toggleMainMenu());
  dispatch(push(Routes.Individual.Overview.Report));
};

export const requestConfirmNavigation = callback => (dispatch, getState) => {
  const { app: { preventNavigation } } = getState();
  if (!preventNavigation) {
    callback(true);
  } else {
    dispatch(setConfirmNavigation(callback));
  }
};

export const confirmNavigation = preventNavigationResult => (dispatch, getState) => {
  const { app: { preventNavigationCallback } } = getState();
  if (typeof preventNavigationCallback === 'function') {
    preventNavigationCallback(preventNavigationResult);
  }
  dispatch(setPreventNavigation(!preventNavigationResult));
  dispatch(setConfirmNavigation(null));
};

export const sendError = error => () => {
  client.sendError(error);
};

export const selectOrganizationID = organizationID => (dispatch, getState) => {
  const { auth } = getState();
  const { currentUser } = auth;
  let organizationIDforSet = organizationID;
  if (!currentUser) {
    return;
  }
  const isCurrentUserOwner = selectors.auth.isCurrentUserOwner(auth);
  if (organizationID) {
    if (organizationID !== currentUser.organization && !isCurrentUserOwner) {
      throw new Error('Switch organization not allowed!');
    }
  } else if (organizationID !== Demo.demoOrganization.id) {
    const previousOrganizationID = window.localStorage.getItem('selectedOrganizationID');
    if (previousOrganizationID && (isCurrentUserOwner || Number(previousOrganizationID) === Demo.demoOrganization.id)) {
      organizationIDforSet = Number(previousOrganizationID);
    } else {
      organizationIDforSet = currentUser.organization;
    }
  }
  window.localStorage.setItem('selectedOrganizationID', organizationIDforSet);
  dispatch(setSelectedOrganizationID(organizationIDforSet));
};

export const selectOwnOrganizationID = () => (dispatch, getState) => {
  const { auth: { currentUser } } = getState();
  dispatch(selectOrganizationID(currentUser.organization));
};

export const getSelectedOrganization = () => (dispatch, getState) => {
  const {
    app: { selectedOrganizationID },
    auth: { currentUser },
    organizations: { organizationList },
  } = getState();
  if (selectedOrganizationID === currentUser.organization) {
    return currentUser.organizationData;
  }
  if (selectedOrganizationID === Demo.demoOrganization.id) {
    return Demo.demoOrganization;
  }
  if (organizationList) {
    const found = organizationList.find(e => e.id === selectedOrganizationID);
    return found || null;
  }
  return null;
};

export const setLanguage = createAction('[app] set language');
export const toggleMainMenu = createAction('[app] toggle main menu');
export const selectSettingsTab = createAction('[app] select settings tab');
export const showNotification = createAction('[app] show notification');
export const dismissNotification = createAction('[app] dismiss notification');
export const setPreventNavigation = createAction('[app] set prevent navigation');
export const setConfirmNavigation = createAction('[app] request confirm navigation');
export const setScreenSize = createAction('[app] set screen size');
export const setSelectedOrganizationID = createAction('[app] set selected organization ID');
