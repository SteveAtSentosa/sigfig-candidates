import React from 'react';
import PropTypes from 'prop-types';
import validator from 'validator';
import { connect } from 'react-redux';
import { withClasses } from 'bem-class-builder';
import { Link } from 'react-router-dom';

import { Routes } from 'Constants';
import { actions } from 'store';
import { withTranslation } from 'utilities/decorators';
import * as CommonModels from 'Models/Common';

import { FormGroup, InputGroup, Button, Intent, Classes } from '@blueprintjs/core';

import { eletiveLogo } from 'images';
import classes from './RestorePasswordPage.scss';

@withClasses(classes, 'restore-password-page')
@withTranslation('RestorePasswordPage')
class RestorePasswordPage extends React.PureComponent {
  static propTypes = {
    restorePasswordStatus: CommonModels.RequestStatus,
    restorePassword: PropTypes.func,
  }

  state = {
    email: '',
    errorMessage: '',
  }

  constructor(props) {
    super(props);

    this.emailInput = React.createRef();
  }

  get isPasswordRestoring() {
    const { restorePasswordStatus } = this.props;
    return restorePasswordStatus === 'pending';
  }

  get isPasswordRestored() {
    const { restorePasswordStatus } = this.props;
    return restorePasswordStatus === 'success';
  }

  setErrorMessage(errorMessage) {
    this.setState({ errorMessage });
  }

  handleFormSubmit = (event) => {
    event.preventDefault();

    const { email } = this.state;
    const { i18n, restorePassword } = this.props;

    const isFormValid = this.isFormValid();
    if (isFormValid === false) {
      return;
    }

    restorePassword(email)
      .then(() => {
        this.emailInput.current.blur();
        this.setErrorMessage('');
      })
      .catch(() => {
        this.setErrorMessage(i18n('ErrorMessages.EmailNotExist'));
      });
  }

  handleEmailChange = (event) => {
    this.setState({
      email: event.target.value,
    });
  }

  isFormValid() {
    const { i18n } = this.props;
    const { email } = this.state;

    if (validator.isEmpty(email)) {
      this.emailInput.current.focus();
      return false;
    }

    if (validator.isEmail(email) === false) {
      this.emailInput.current.focus();
      this.setErrorMessage(i18n('ErrorMessages.EmailWrongFormat'));
      return false;
    }

    return true;
  }

  renderEmailLabel() {
    const { i18n } = this.props;

    return (
      <div className={Classes.TEXT_MUTED}>
        {i18n('Fields.Email.Label')}
      </div>
    );
  }

  renderErrorMessage = () => {
    const { cls } = this.props;
    const { errorMessage } = this.state;

    return errorMessage && (
      <div className={cls('error-message')}>
        {errorMessage}
      </div>
    );
  }

  render() {
    const { cls, i18n } = this.props;
    const { email, errorMessage } = this.state;

    return (
      <div className={cls()}>
        <div className={cls('form-container')}>
          <div className={cls('form')}>
            <i
              className={cls('logo')}
              dangerouslySetInnerHTML={{ __html: eletiveLogo }}
            />

            <form className={this.classes} onSubmit={this.handleFormSubmit}>
              <h1 className={cls('title')}>
                {i18n('Title')}
              </h1>

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

              <Button
                fill
                type="submit"
                text={i18n('SubmitButton.Text')}
                intent={Intent.PRIMARY}
                loading={this.isPasswordRestoring}
                className={Classes.LARGE}
              />

              <div className={cls('link-container')}>
                <Link to={Routes.Signin} className={cls('signin-page-link')}>
                  {i18n('SigninPageLink.Text')}
                </Link>
              </div>

              {
                this.isPasswordRestored &&
                <div className={cls('success-container')}>
                  <h3 className={cls('success-title')}>
                    {i18n('SuccessMessage.Title')}
                  </h3>

                  <p>
                    {i18n('SuccessMessage.Description')}
                  </p>
                </div>
              }
            </form>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps({ auth }) {
  const { restorePasswordStatus } = auth;

  return {
    restorePasswordStatus,
  };
}

export default connect(mapStateToProps, { ...actions.auth })(RestorePasswordPage);
