import React from 'react';
import Loadable from 'react-loadable';
import Loading from 'Components/Loading/Loading';

export const CommentsPage = Loadable({
  loader: () => import('./CommentsPage/CommentsPage.Container'),
  render: ({ CommentsPageContainer: Component }, props) => <Component {...props} />,
  loading: Loading,
});
