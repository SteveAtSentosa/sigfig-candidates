import React from 'react';
import PropTypes from 'prop-types';
import zxcvbn from 'zxcvbn';
import validator from 'validator';
import {
  FormActions,
  FormGroup,
  InputGroup,
  RateMeter,
  RoundedButtonIntent,
  ErrorPopover,
} from 'Components/Common';

import { Intent } from 'Components/Common/Inputs/Intent';

import { withTranslation } from 'utilities/decorators';

import * as Own from './ChangePasswordForm.Components';

@withTranslation('Auth/ChangePasswordForm')
class ChangePasswordForm extends React.PureComponent {
  static propTypes = {
    acceptCurrentPassword: PropTypes.bool,
    onPasswordChange: PropTypes.func,
  }

  static defaultProps = {
    acceptCurrentPassword: false,
  }

  state = {
    currentPassword: '',
    firstPassword: '',
    secondPassword: '',
    firstPasswordVisible: false,
    secondPasswordVisible: false,
    errorMessage: '',
    currentPasswordErrorMessage: '',
    passwordStrength: null,
  }

  constructor(props) {
    super(props);

    this.initialState = this.state;

    this.firstPasswordInput = React.createRef();
    this.secondPasswordInput = React.createRef();
    this.currentPasswordInput = React.createRef();
  }

  get firstPasswordInputType() {
    const { firstPasswordVisible } = this.state;
    return firstPasswordVisible ? 'text' : 'password';
  }

  get secondPasswordInputType() {
    const { secondPasswordVisible } = this.state;
    return secondPasswordVisible ? 'text' : 'password';
  }

  getPasswordRatings() {
    const { i18n } = this.props;
    return [
      { color: '#e0786d', label: i18n('PasswordStrength.VeryWeak') },
      { color: '#eb948a', label: i18n('PasswordStrength.Weak') },
      { color: '#eecd81', label: i18n('PasswordStrength.Medium') },
      { color: '#82d4a1', label: i18n('PasswordStrength.Strong') },
      { color: '#7dc398', label: i18n('PasswordStrength.VeryStrong') },
    ];
  }

  getFormActions() {
    const { i18n } = this.props;
    const actions = [];

    actions.push({
      onClick: this.handleFormSubmit,
      children: i18n('SubmitButton.Text'),
      intent: RoundedButtonIntent.SUCCESS,
    });

    return actions;
  }

  validateForm = () => {
    const { i18n } = this.props;
    const { acceptCurrentPassword, currentPassword, firstPassword, secondPassword } = this.state;

    if (acceptCurrentPassword && validator.isEmpty(currentPassword)) {
      this.setState({
        currentPasswordErrorMessage: i18n('ErrorMessages.CurrentPasswordRequired'),
      });
      this.currentPasswordInput.current.focus();
      return false;
    }

    if (firstPassword.length < 6) {
      this.firstPasswordInput.current.focus();
      this.setState({
        errorMessage: i18n('ErrorMessages.PasswordTooShort'),
      });
      return false;
    }

    if (firstPassword !== secondPassword) {
      this.firstPasswordInput.current.focus();
      this.setState({
        errorMessage: i18n('ErrorMessages.PasswordsNotMatch'),
      });
      return false;
    }

    this.setState({ errorMessage: '' });

    return true;
  }

  resetState = () => {
    this.setState({ ...this.initialState });
  }

  handleFormSubmit = async (event) => {
    event.preventDefault();

    const isFormValid = this.validateForm();
    if (isFormValid === false) {
      return;
    }

    const { acceptCurrentPassword, onPasswordChange } = this.props;
    const { currentPassword, firstPassword } = this.state;

    if (acceptCurrentPassword) {
      await onPasswordChange(currentPassword, firstPassword);
      this.resetState();
    } else {
      onPasswordChange(firstPassword);
    }
  }

  handleCurrentPasswordChange = (inputValue) => {
    this.setState({ currentPassword: inputValue, currentPasswordErrorMessage: '' });
  }

  handleFirstPasswordChange = (inputValue) => {
    this.setState({
      firstPassword: inputValue,
      passwordStrength: validator.isEmpty(inputValue) === false ?
        zxcvbn(inputValue).score :
        null,
      errorMessage: '',
    });
  }

  handleSecondPasswordChange = (inputValue) => {
    this.setState({
      secondPassword: inputValue,
      errorMessage: '',
    });
  }

  handleToggleFirstPasswordVisibilityButtonClick = () => {
    this.setState(({ firstPasswordVisible }) => ({
      firstPasswordVisible: !firstPasswordVisible,
    }));
  }

  handleToggleSecondPasswordVisibilityButtonClick = () => {
    this.setState(({ secondPasswordVisible }) => ({
      secondPasswordVisible: !secondPasswordVisible,
    }));
  }

  renderCurrentPasswordLabel() {
    const { i18n } = this.props;

    return (
      <Own.PasswordLabel>
        {i18n('Fields.CurrentPassword.Label')}
      </Own.PasswordLabel>
    );
  }

  renderFirstPasswordLabel() {
    const { i18n } = this.props;
    const { firstPasswordVisible } = this.state;

    const buttonText = firstPasswordVisible ?
      i18n('HidePasswordButton.Text') :
      i18n('ShowPasswordButton.Text');

    return (
      <Own.PasswordLabel>
        <span>
          {i18n('Fields.Password.Label')}
        </span>

        <Own.TogglePasswordVisibilityButton onClick={this.handleToggleFirstPasswordVisibilityButtonClick}>
          {firstPasswordVisible ? <Own.EyeClosedIcon /> : <Own.EyeOpenIcon />}
          {buttonText}
        </Own.TogglePasswordVisibilityButton>
      </Own.PasswordLabel>
    );
  }

  renderSecondPasswordLabel() {
    const { i18n } = this.props;
    const { secondPasswordVisible } = this.state;

    const buttonText = secondPasswordVisible ?
      i18n('HidePasswordButton.Text') :
      i18n('ShowPasswordButton.Text');

    return (
      <Own.PasswordLabel>
        <span>
          {i18n('Fields.RepeatPassword.Label')}
        </span>

        <Own.TogglePasswordVisibilityButton onClick={this.handleToggleSecondPasswordVisibilityButtonClick}>
          {secondPasswordVisible ? <Own.EyeClosedIcon /> : <Own.EyeOpenIcon />}
          {buttonText}
        </Own.TogglePasswordVisibilityButton>
      </Own.PasswordLabel>
    );
  }

  render() {
    const { i18n, acceptCurrentPassword } = this.props;
    const {
      currentPassword,
      firstPassword,
      secondPassword,
      errorMessage,
      passwordStrength,
      currentPasswordErrorMessage,
    } = this.state;
    const passwordRatings = this.getPasswordRatings();
    const passwordNoRatingLabel = i18n('PasswordStrength.NoPassword');
    return (
      <Own.Container>
        {
          acceptCurrentPassword &&
          <Own.CurrentPasswordContainer>
            <FormGroup label={this.renderCurrentPasswordLabel()}>
              <ErrorPopover content={currentPasswordErrorMessage}>
                <InputGroup
                  type="password"
                  value={currentPassword}
                  autoComplete="current-password"
                  inputRef={this.currentPasswordInput}
                  onChange={this.handleCurrentPasswordChange}
                />
              </ErrorPopover>
            </FormGroup>
          </Own.CurrentPasswordContainer>
        }

        <FormGroup
          label={this.renderFirstPasswordLabel()}
        >
          <ErrorPopover content={errorMessage}>
            <InputGroup
              type={this.firstPasswordInputType}
              value={firstPassword}
              autoComplete="new-password"
              intent={errorMessage ? Intent.DANGER : Intent.NONE}
              inputRef={this.firstPasswordInput}
              onChange={this.handleFirstPasswordChange}
            />
          </ErrorPopover>
        </FormGroup>
        <Own.PasswordRateMeterContainer>
          <RateMeter
            ratingScore={passwordStrength}
            ratings={passwordRatings}
            noRatingLabel={passwordNoRatingLabel}
          />
        </Own.PasswordRateMeterContainer>
        <FormGroup label={this.renderSecondPasswordLabel()}>
          <InputGroup
            type={this.secondPasswordInputType}
            value={secondPassword}
            autoComplete="new-password"
            inputRef={this.secondPasswordInput}
            onChange={this.handleSecondPasswordChange}
          />
        </FormGroup>
        <FormActions actions={this.getFormActions()} />
      </Own.Container>
    );
  }
}

export { ChangePasswordForm };
