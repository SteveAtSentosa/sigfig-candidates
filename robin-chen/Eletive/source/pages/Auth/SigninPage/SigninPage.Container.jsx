import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { actions } from 'store';
import * as UserModels from 'Models/Users';
import * as CommonModels from 'Models/Common';

import { SigninPage } from './SigninPage';

class SinginPageContainer extends React.Component {
  static propTypes = {
    currentUser: UserModels.CurrentUser,
    signinStatus: CommonModels.RequestStatus,
    signin: PropTypes.func,
  }

  handleSignin = (email, password, token) => {
    const { signin } = this.props;
    return signin(email, password, token);
  }

  render() {
    const { signinStatus, ...restProps } = this.props;

    return (
      <SigninPage
        {...restProps}
        isLoggingIn={signinStatus === 'pending'}
        onSignin={this.handleSignin}
      />
    );
  }
}

const mapStateToProps = ({ auth }) => {
  const { currentUser, signinStatus } = auth;

  return {
    currentUser,
    signinStatus,
  };
};

const ConnectedSigninPageContainer = connect(mapStateToProps, { ...actions.auth })(SinginPageContainer);

export { ConnectedSigninPageContainer as SigninPageContainer };
