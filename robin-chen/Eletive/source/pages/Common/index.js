import Loadable from 'react-loadable';
import Loading from 'Components/Loading/Loading';

export const PrivacyPage = Loadable({
  loader: () => import('./PrivacyPage/PrivacyPage'),
  loading: Loading,
});
