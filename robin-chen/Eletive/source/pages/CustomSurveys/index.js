import React from 'react';
import Loadable from 'react-loadable';
import Loading from 'Components/Loading/Loading';

export const CustomSurveysPage = Loadable({
  loader: () => import('./CustomSurveysPage/CustomSurveysPage.Container'),
  render: ({ CustomSurveysPageContainer: Component }, props) => <Component {...props} />,
  loading: Loading,
});
