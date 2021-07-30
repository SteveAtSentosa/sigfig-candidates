import React from 'react';
import Loadable from 'react-loadable';
import Loading from 'Components/Loading/Loading';

export const DashboardPage = Loadable({
  loader: () => import('./Dashboard/Dashboard.Container'),
  render: ({ DashboardContainer }, props) => <DashboardContainer {...props} />,
  loading: Loading,
});
