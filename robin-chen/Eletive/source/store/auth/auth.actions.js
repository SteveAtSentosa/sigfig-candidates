/* eslint no-use-before-define: 0 */
import { createAction } from 'redux-act';
import { createActionWithStatuses } from 'utilities/store';

import client from 'api/client';
import * as api from 'api/auth';

import { actions } from 'store';
import { i18n } from 'utilities/decorators';

export const setCurrentUser = createAction('[auth] set current user');

export const init = () => (dispatch) => {
  dispatch(loadCurrentUser());
};

export const signin = createActionWithStatuses(
  '[auth] signin',
  (email, password, token) => (dispatch) => {
    dispatch(signin.start());

    return client.signin(email, password, token)
      .then(({ accessToken, userData }) => {
        dispatch(signin.success());

        client.setUserData(userData);
        client.setAccessToken(accessToken);
        client.setUserLanguage(userData.language);

        dispatch(loadCurrentUser());
        dispatch(actions.app.loadLanguage());

        window.location = '/';
      })
      .catch((error) => {
        dispatch(signin.failure());
        throw error;
      });
  },
);

export const logout = () => (dispatch) => {
  const { app: { requestConfirmNavigation } } = actions;

  dispatch(requestConfirmNavigation((confirm) => {
    if (confirm) {
      dispatch(setCurrentUser(null));

      window.sessionStorage.clear();
    }
  }));
};

export const restorePassword = createActionWithStatuses(
  '[auth] restore password',
  email => (dispatch) => {
    dispatch(restorePassword.start());

    return client.restorePassword(email)
      .then(() => {
        dispatch(restorePassword.success());
      })
      .catch((error) => {
        dispatch(restorePassword.failure());
        throw error;
      });
  },
);

export const changePassword = createActionWithStatuses(
  '[auth] change password',
  (password, accessToken) => (dispatch) => {
    dispatch(changePassword.start());

    return client.changePassword(password, accessToken)
      .then(({ accessToken: newAccessToken, currentUser }) => {
        dispatch(changePassword.success());
        dispatch(setCurrentUser(currentUser));
        dispatch(actions.app.selectOrganizationID());

        client.setUserData(currentUser);
        window.sessionStorage.setItem('accessToken', newAccessToken);
      })
      .catch(() => {
        dispatch(changePassword.failure());
      });
  },
);

export const changeCurrentPassword = createActionWithStatuses(
  '[auth] change current password',
  (currentPassword, newPassword) => (dispatch) => {
    dispatch(changeCurrentPassword.start());

    return client.changeCurrentPassword(currentPassword, newPassword)
      .then(({ accessToken: newAccessToken, currentUser }) => {
        dispatch(changeCurrentPassword.success());
        dispatch(setCurrentUser(currentUser));
        dispatch(actions.app.selectOrganizationID());

        client.setUserData(currentUser);
        window.sessionStorage.setItem('accessToken', newAccessToken);

        dispatch(actions.app.showNotification({
          icon: 'tick',
          timeout: 3000,
          intent: 'success',
          message: i18n.global('User/ChangePasswordPage.SuccessNotification.Text'),
        }));
      })
      .catch((error) => {
        dispatch(changeCurrentPassword.failure());

        dispatch(actions.app.showNotification({
          icon: 'tick',
          timeout: 3000,
          intent: 'danger',
          message: i18n.global('User/ChangePasswordPage.ErrorNotification.Text'),
        }));

        throw error;
      });
  },
);

export const updateCurrentUser = createActionWithStatuses(
  '[auth] update current user',
  user => (dispatch, getState) => {
    dispatch(updateCurrentUser.start());

    return api.updateCurrentUser(user)
      .then(async (updatedUserDetails) => {
        dispatch(updateCurrentUser.success(updatedUserDetails));

        const { auth: { currentUser } } = getState();
        client.setUserData(currentUser);

        const { language } = currentUser;
        await dispatch(actions.app.updateLanguage(language));

        dispatch(actions.app.showNotification({
          icon: 'tick',
          timeout: 3000,
          intent: 'success',
          message: i18n.global('User/UserProfilePage.SuccessNotification.Text'),
        }));
      })
      .catch(() => {
        dispatch(updateCurrentUser.failure());
      });
  },
);

export const loadCurrentUser = () => (dispatch) => {
  const currentUser = client.getCurrentUser();
  if (currentUser) {
    dispatch(setCurrentUser(currentUser));
    dispatch(actions.app.selectOrganizationID());
  }
};

export const fetchCurrentUserData = () => dispatch => (
  client.fetchCurrentUserData()
    .then((currentUser) => {
      client.setUserData(currentUser);
      dispatch(setCurrentUser(currentUser));
      dispatch(actions.app.selectOrganizationID());
    })
);

export const consentGdpr = () => dispatch => (
  client.consentGdpr()
    .then(() => {
      const currentUser = client.getCurrentUser();
      currentUser.gdprConsented = 1;

      client.setUserData(currentUser);
      dispatch(setCurrentUser(currentUser));
    })
);

export const generateTwoFactorAuthSecretKey = createActionWithStatuses(
  '[auth] generate two factor auth secret key',
  () => () => api.generateTwoFactorAuthSecretKey(),
);

export const enableTwoFactorAuth = createActionWithStatuses(
  '[auth] enable two factor auth',
  (secretKey, token) => dispatch => (
    api.enableTwoFactorAuth(secretKey, token)
      .then(() => {
        const currentUser = client.getCurrentUser();
        currentUser.isMFAEnabled = true;

        client.setUserData(currentUser);
        dispatch(setCurrentUser(currentUser));

        dispatch(actions.app.showNotification({
          icon: 'tick',
          timeout: 3000,
          intent: 'success',
          message: i18n.global('User/SecurityPage.EnableSuccessNotification.Text'),
        }));
      })
      .catch((error) => {
        dispatch(actions.app.showNotification({
          icon: 'tick',
          timeout: 3000,
          intent: 'danger',
          message: i18n.global('User/SecurityPage.EnableErrorNotification.Text'),
        }));

        throw error;
      })
  ),
);

export const disableTwoFactorAuth = createActionWithStatuses(
  '[auth] disable two factor auth',
  () => dispatch => (
    api.disableTwoFactorAuth()
      .then(() => {
        const currentUser = client.getCurrentUser();
        currentUser.isMFAEnabled = false;

        client.setUserData(currentUser);
        dispatch(setCurrentUser(currentUser));

        dispatch(actions.app.showNotification({
          icon: 'tick',
          timeout: 3000,
          intent: 'success',
          message: i18n.global('User/SecurityPage.DisableSuccessNotification.Text'),
        }));
      })
  ),
);
