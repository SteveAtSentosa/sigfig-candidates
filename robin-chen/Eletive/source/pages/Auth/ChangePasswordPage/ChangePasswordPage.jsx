import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Routes } from 'Constants';
import { actions, selectors } from 'store';

import { validateToken } from 'utilities/token';
import { withTranslation } from 'utilities/decorators';

import { ChangePasswordForm } from 'Components/Auth';

import * as Own from './ChangePasswordPage.Components';

@withTranslation('Auth/ChangePasswordPage')
class ChangePasswordPage extends React.PureComponent {
  static propTypes = {
    isPasswordChanging: PropTypes.bool,
    changePassword: PropTypes.func,
    showNotification: PropTypes.func,
  }

  static defaultProps = {
    isPasswordChanging: false,
  }

  state = {
    token: '',
  }

  componentDidMount() {
    const { i18n, match } = this.props;
    const { token } = match.params;

    if (this.isTokenValid) {
      this.setState({ token });
      return;
    }

    const { history, showNotification } = this.props;
    history.push(Routes.Signin);

    showNotification({
      intent: 'danger',
      timeout: 0,
      message: i18n.global('Notifications.ExpiredToken.Content'),
    });
  }

  get isTokenValid() {
    const { match } = this.props;
    const { token } = match.params;

    return validateToken(token);
  }

  handlePasswordChange = async (password) => {
    const { changePassword } = this.props;
    const { token } = this.state;

    await changePassword(password, token);

    const { history } = this.props;
    history.push(Routes.Home);
  }

  render() {
    const { i18n, isPasswordChanging } = this.props;

    return (
      <Own.Container>
        <Own.FormContainer>
          <Own.Logo />

          <Own.Title>
            {i18n('Title')}
          </Own.Title>

          <Own.ChangePasswordFormWrapper>
            <ChangePasswordForm
              isPasswordChanging={isPasswordChanging}
              onPasswordChange={this.handlePasswordChange}
            />
          </Own.ChangePasswordFormWrapper>

          <Own.LinkContainer>
            <Own.SigninPageLink to={Routes.Signin}>
              {i18n('SigninPageLink.Text')}
            </Own.SigninPageLink>
          </Own.LinkContainer>
        </Own.FormContainer>
      </Own.Container>
    );
  }
}

function mapStateToProps({ auth }) {
  const { isPasswordChanging } = selectors.auth;

  return {
    isPasswordChanging: isPasswordChanging(auth),
  };
}

export default connect(mapStateToProps, {
  ...actions.app,
  ...actions.auth,
})(ChangePasswordPage);
