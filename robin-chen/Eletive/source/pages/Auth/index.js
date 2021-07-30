import React from 'react';
import Loadable from 'react-loadable';
import Loading from 'Components/Loading/Loading';

export const SigninPage = Loadable({
  loader: () => import('./SigninPage/SigninPage.Container'),
  render: ({ SigninPageContainer }, props) => <SigninPageContainer {...props} />,
  loading: Loading,
});

export const ChangePasswordPage = Loadable({
  loader: () => import('./ChangePasswordPage/ChangePasswordPage'),
  loading: Loading,
});

export const RestorePasswordPage = Loadable({
  loader: () => import('./RestorePasswordPage/RestorePasswordPage'),
  loading: Loading,
});
