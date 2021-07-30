import React from 'react';
import Loadable from 'react-loadable';
import Loading from 'Components/Loading/Loading';

export const ActionsPage = Loadable({
  loader: () => import('./ActionsPage/ActionsPage.Container'),
  render: ({ ActionsPageContainer: Component }, props) => <Component {...props} />,
  loading: Loading,
});
