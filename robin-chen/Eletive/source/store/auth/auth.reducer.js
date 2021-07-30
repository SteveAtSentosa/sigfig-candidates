import { createReducer } from 'redux-act';
import * as actions from './auth.actions';

const initialState = {
  currentUser: null,
  signinStatus: '',
  changePasswordStatus: '',
  changeCurrentPasswordStatus: '',
  restorePasswordStatus: '',
  updateCurrentUserStatus: '',
};

const reducer = {
  [actions.setCurrentUser]: (state, currentUser) => ({
    ...state,
    currentUser,
  }),

  [actions.signin.start]: state => ({
    ...state,
    signinStatus: 'pending',
  }),

  [actions.signin.success]: state => ({
    ...state,
    signinStatus: 'success',
  }),

  [actions.signin.failure]: state => ({
    ...state,
    signinStatus: 'failure',
  }),

  [actions.restorePassword.start]: state => ({
    ...state,
    restorePasswordStatus: 'pending',
  }),

  [actions.restorePassword.success]: state => ({
    ...state,
    restorePasswordStatus: 'success',
  }),

  [actions.restorePassword.failure]: state => ({
    ...state,
    restorePasswordStatus: 'failure',
  }),

  [actions.changePassword.start]: state => ({
    ...state,
    changePasswordStatus: 'pending',
  }),

  [actions.changePassword.success]: state => ({
    ...state,
    changePasswordStatus: 'success',
  }),

  [actions.changePassword.failure]: state => ({
    ...state,
    changePasswordStatus: 'failure',
  }),

  [actions.changeCurrentPassword.start]: state => ({
    ...state,
    changeCurrentPasswordStatus: 'pending',
  }),

  [actions.changeCurrentPassword.success]: state => ({
    ...state,
    changeCurrentPasswordStatus: 'success',
  }),

  [actions.changeCurrentPassword.failure]: state => ({
    ...state,
    changeCurrentPasswordStatus: 'failure',
  }),

  [actions.updateCurrentUser.start]: state => ({
    ...state,
    updateCurrentUserStatus: 'pending',
  }),

  [actions.updateCurrentUser.success]: (state, updatedUserDetails) => ({
    ...state,
    updateCurrentUserStatus: 'success',
    currentUser: {
      ...state.currentUser,
      ...updatedUserDetails,
    },
  }),

  [actions.updateCurrentUser.failure]: state => ({
    ...state,
    updateCurrentUserStatus: 'failure',
  }),
};

export default createReducer(reducer, initialState);
