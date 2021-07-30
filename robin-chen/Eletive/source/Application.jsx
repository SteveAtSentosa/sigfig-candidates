import { hot } from 'react-hot-loader/root';
import React from 'react';
import PropTypes from 'prop-types';
import { Switch, Route, withRouter, Prompt } from 'react-router-dom';
import { connect } from 'react-redux';
import IdleTimer from 'react-idle-timer';

import { withTranslation } from 'utilities/decorators';
import { getScreenSize } from 'utilities/common';
import { exclamationIcon } from 'images/icons/common';

import { actions } from 'store';
import { Routes } from 'Constants';
import * as UserModels from 'Models/Users';

import { DashboardPage } from 'Pages';
import { Alert, AlertIntent, ErrorBoundary, RoundedButtonIntent } from 'Components/Common';
import { NotificationsContainer } from 'Components/Application';

import { SurveyPage } from 'Pages/Survey';
import { PrivacyPage } from 'Pages/Common';

import 'styles/index.scss';

import {
  SigninPage,
  ChangePasswordPage,
  RestorePasswordPage,
} from 'Pages/Auth';

@withTranslation()
class Application extends React.Component {
  static propTypes = {
    currentUser: UserModels.CurrentUser,
    preventNavigation: PropTypes.bool,
    preventNavigationConfirmShow: PropTypes.bool,
    logout: PropTypes.func,
    showNotification: PropTypes.func,
    confirmNavigation: PropTypes.func,
    setPreventNavigation: PropTypes.func,
    onScreenResize: PropTypes.func,
  }

  constructor(props) {
    window.addEventListener('resize', (e) => {
      const { onScreenResize } = props;
      onScreenResize(getScreenSize(e.target.innerWidth));
    });
    super(props);
  }

  get preventNavigationActions() {
    const { i18n } = this.props;
    return [
      {
        text: i18n.global('NavigateConfirmation.CancelButtonText'),
        intent: RoundedButtonIntent.SECONDARY,
        onClick: this.handleNavigateConfirmationCancel,
      },
      {
        text: i18n.global('NavigateConfirmation.ConfirmButtonText'),
        intent: RoundedButtonIntent.SUCCESS,
        onClick: this.handleNavigateConfirmationConfirm,
      },
    ];
  }

  handleIdleRequest = () => {
    const { i18n, history, logout, showNotification, setPreventNavigation } = this.props;

    setPreventNavigation(false);
    logout();
    history.push(Routes.Signin);

    showNotification({
      intent: 'warning',
      timeout: 0,
      message: i18n.global('Notifications.SessionTimeout.Content'),
    });
  }

  handleNavigateConfirmationCancel = () => {
    const { confirmNavigation } = this.props;
    confirmNavigation(false);
  }

  handleNavigateConfirmationConfirm = () => {
    const { confirmNavigation } = this.props;
    confirmNavigation(true);
  }

  render() {
    const { i18n, currentUser, preventNavigation, preventNavigationConfirmShow } = this.props;

    return (
      <React.Fragment>
        <ErrorBoundary>
          <Switch>
            <Route path={Routes.Survey} component={SurveyPage} />
            <Route path={Routes.ChangePassword} component={ChangePasswordPage} />
            <Route path={Routes.Privacy} component={PrivacyPage} />
            <Route path={Routes.Signin} component={SigninPage} />
            <Route path={Routes.RestorePassword} component={RestorePasswordPage} />
            <Route path={Routes.Home} component={DashboardPage} />
          </Switch>
        </ErrorBoundary>

        <NotificationsContainer />

        {
          currentUser &&
          <IdleTimer
            element={document}
            debounce={250}
            timeout={15 * 60 * 1000}
            onIdle={this.handleIdleRequest}
          />
        }

        <Prompt
          when={preventNavigation}
          message={() => i18n.global('NavigateConfirmation.Content')}
        />

        <Alert
          isOpen={preventNavigationConfirmShow}
          title={<b>{i18n.global('NavigateConfirmation.Title')}</b>}
          description={i18n.global('NavigateConfirmation.Content')}
          icon={exclamationIcon}
          intent={AlertIntent.DANGER}
          actions={this.preventNavigationActions}
          onClose={this.handleNavigateConfirmationCancel}
        />
      </React.Fragment>
    );
  }
}

function mapStateToProps({ app, auth }) {
  const { currentUser } = auth;
  const {
    preventNavigation,
    preventNavigationConfirmShow,
  } = app;

  return {
    currentUser,
    preventNavigation,
    preventNavigationConfirmShow,
  };
}

const ConnectedApplication = connect(mapStateToProps, {
  ...actions.app,
  ...actions.auth,
})(Application);

const ConnectedApplicationWithRouter = hot(withRouter(ConnectedApplication));

export { ConnectedApplicationWithRouter as Application };
