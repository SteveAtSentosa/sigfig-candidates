import React from 'react';
import PropTypes from 'prop-types';
import validator from 'validator';
import { FormGroup, InputGroup, Button, Intent, Classes } from '@blueprintjs/core';

import { withTranslation } from 'utilities/decorators';

import { Routes } from 'Constants';
import * as UserModels from 'Models/Users';

import { AuthTokenInput } from 'Components/Auth';

import {
  Container,
  FormContainer,
  Form,
  EletiveLogo,
  Title,
  LinkContainer,
  ForgotPasswordLink,
  PasswordIcon,
  PasswordLabel,
  ErrorMessage,
  AuthTokenErrorMessage,
  AuthTokenInputLabel,
  AuthTokenInputContainer,
  TogglePasswordVisibilityButton,
} from './SigninPage.Components';

@withTranslation('Auth/SigninPage')
class SigninPage extends React.PureComponent {
  static propTypes = {
    currentUser: UserModels.CurrentUser,
    isLoggingIn: PropTypes.bool,
    onSignin: PropTypes.func,
  }

  static defaultProps = {
    isLoggingIn: false,
  }

  state = {
    email: '',
    password: '',
    authToken: '',
    errorMessage: '',
    authTokenErrorMessage: '',
    passwordVisible: false,
    authTokenInputVisible: false,
  }

  constructor(props) {
    super(props);

    this.emailInput = React.createRef();
    this.passwordInput = React.createRef();
    this.authTokenInput = React.createRef();
  }

  componentDidMount() {
    const { currentUser } = this.props;

    if (currentUser) {
      this.setState({ email: currentUser.email });
    }
  }

  get passwordInputType() {
    const { passwordVisible } = this.state;
    return passwordVisible ? 'text' : 'password';
  }

  validateForm = () => {
    const { i18n } = this.props;
    const { email, password } = this.state;

    if (validator.isEmpty(email)) {
      this.emailInput.current.focus();
      return false;
    }

    if (validator.isEmpty(password)) {
      this.passwordInput.current.focus();
      return false;
    }

    if (validator.isEmail(email) === false) {
      this.emailInput.current.focus();
      this.setState({
        errorMessage: i18n('ErrorMessages.EmailWrongFormat'),
      });
      return false;
    }

    return true;
  }

  handleFailedSignin = (errorMessage) => {
    const { i18n } = this.props;

    if (errorMessage === 'ACCESS_RESTRICTED') {
      const { authToken } = this.state;

      if (authToken) {
        this.setState({
          authTokenErrorMessage: i18n('ErrorMessages.WrongAuthToken'),
        });
      } else {
        this.emailInput.current.focus();

        this.setState({
          errorMessage: i18n('ErrorMessages.WrongEmailPassword'),
        });
      }
    }

    if (errorMessage === 'MFA_TOKEN_REQUIRED') {
      this.setState({
        errorMessage: '',
        authTokenInputVisible: true,
      }, () => {
        this.authTokenInput.current.focus();
      });
    }

    const { authTokenInputVisible } = this.state;
    if (authTokenInputVisible) {
      this.authTokenInput.current.clear();
      this.authTokenInput.current.focus();
    }
  }

  handleFormSubmit = (event) => {
    event.preventDefault();

    const isFormValid = this.validateForm();
    if (isFormValid === false) {
      return;
    }

    const { onSignin } = this.props;
    const { email, password } = this.state;

    onSignin(email, password)
      .catch((error) => {
        this.handleFailedSignin(error);
      });
  }

  handleEmailChange = (event) => {
    this.setState({
      email: event.target.value,
    });
  }

  handlePasswordChange = (event) => {
    this.setState({
      password: event.target.value,
    });
  }

  handleTogglePasswordVisibilityButtonClick = () => {
    this.setState(({ passwordVisible }) => ({
      passwordVisible: !passwordVisible,
    }));
  }

  handleAuthTokenInputComplete = (authToken) => {
    const { onSignin } = this.props;
    const { email, password } = this.state;

    this.setState({ authToken });
    this.authTokenInput.current.blur();

    onSignin(email, password, authToken)
      .catch((error) => {
        this.handleFailedSignin(error);
      });
  }

  renderEmailLabel() {
    const { i18n } = this.props;

    return (
      <div className={Classes.TEXT_MUTED}>
        {i18n('Fields.Email.Label')}
      </div>
    );
  }

  renderPasswordLabel() {
    const { i18n } = this.props;
    const { passwordVisible } = this.state;

    const iconName = passwordVisible ? 'eye-off' : 'eye-open';
    const buttonText = passwordVisible ?
      i18n('HidePasswordButton.Text') :
      i18n('ShowPasswordButton.Text');

    return (
      <PasswordLabel>
        <span>
          {i18n('Fields.Password.Label')}
        </span>

        <TogglePasswordVisibilityButton onClick={this.handleTogglePasswordVisibilityButtonClick}>
          <PasswordIcon icon={iconName} />
          {buttonText}
        </TogglePasswordVisibilityButton>
      </PasswordLabel>
    );
  }

  renderErrorMessage() {
    const { errorMessage } = this.state;

    return errorMessage && (
      <ErrorMessage>
        {errorMessage}
      </ErrorMessage>
    );
  }

  render() {
    const { i18n, isLoggingIn } = this.props;
    const { email, password, errorMessage, authTokenErrorMessage, authTokenInputVisible } = this.state;

    return (
      <Container>
        <FormContainer>
          <Form>
            <EletiveLogo />

            <form onSubmit={this.handleFormSubmit}>
              <Title>
                {i18n('Title')}
              </Title>

              <FormGroup
                label={this.renderEmailLabel()}
                helperText={this.renderErrorMessage()}
              >
                <InputGroup
                  name="email"
                  value={email}
                  autoComplete="email"
                  intent={errorMessage ? Intent.DANGER : Intent.NONE}
                  inputRef={this.emailInput}
                  onChange={this.handleEmailChange}
                />
              </FormGroup>

              <FormGroup label={this.renderPasswordLabel()}>
                <InputGroup
                  name="password"
                  type={this.passwordInputType}
                  autoComplete="current-password"
                  value={password}
                  inputRef={this.passwordInput}
                  onChange={this.handlePasswordChange}
                />
              </FormGroup>

              {
                authTokenErrorMessage &&
                <AuthTokenErrorMessage as="p">
                  {authTokenErrorMessage}
                </AuthTokenErrorMessage>
              }

              {
                authTokenInputVisible &&
                <React.Fragment>
                  <AuthTokenInputLabel>
                    {i18n('Fields.AuthToken.Label')}
                  </AuthTokenInputLabel>

                  <AuthTokenInputContainer>
                    <AuthTokenInput
                      ref={this.authTokenInput}
                      onTokenInputComplete={this.handleAuthTokenInputComplete}
                    />
                  </AuthTokenInputContainer>
                </React.Fragment>
              }

              <Button
                fill
                type="submit"
                text={i18n('SigninButton.Text')}
                intent={Intent.PRIMARY}
                loading={isLoggingIn}
                className={Classes.LARGE}
              />

              <LinkContainer>
                <ForgotPasswordLink to={Routes.RestorePassword}>
                  {i18n('ForgotPasswordLink.Text')}
                </ForgotPasswordLink>
              </LinkContainer>
            </form>
          </Form>
        </FormContainer>
      </Container>
    );
  }
}

export { SigninPage };
