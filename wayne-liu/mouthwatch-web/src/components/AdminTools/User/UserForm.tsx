import * as React from 'react'

import { CleaveInput, SelectInput, TextInput } from '#/components/Form/Input'
import { FormProps, FormValues, FormState as State } from './types'
import { InjectedFormProps, reduxForm } from 'redux-form'
import { isSuperUser, removeUSACountryCode } from '#/utils'

import { AvatarUpload } from '#/components/AccountAvatar'
import ConnectedAccountRoleField from '#/components/Form/ConnectedFields/ConnectedAccountRoleField'
import Field from '#/components/Form/Field'
import { GroupsFormSection } from '#/components/Form/FormSections'
import Label from '#/components/Form/Label'
import ProfileTitle from '#/components/AdminTools/ProfileTitle'
import { RequiredIndicator } from '#/components/Form/RequiredIndicator'
import { ResetPasswordModal } from '#/components/ChangePassword'
import { TIMEZONE_OPTIONS } from '#/components/Form/constants'
import validate from './validation'

const styles = require('#/components/AdminTools/styles.scss')

class UserForm extends React.PureComponent<InjectedFormProps<FormValues, FormProps> & FormProps, State> {
  state: State = {
    isResetOpen: false
  }

  private openResetModal = () => {
    this.setState({ isResetOpen: true })
  }

  private closeResetModal = () => {
    this.setState({ isResetOpen: false })
  }

  private onFileChosen = (value) => {
    this.props.change('picture', value)
  }

  private get isOwnAccount () {
    return this.props.account && this.props.loggedInUser.id === this.props.account.id
  }

  private get newAccount () {
    return this.props.account ? false : true
  }

  render () {
    const {
      change, groupOptions, practiceOptions, changeSelectedGroupId, loggedInUser,
      disableGroupDropdown
    } = this.props
    return (
      <>
        <form id={this.props.form} className={styles.form} onSubmit={this.props.handleSubmit}>
          <ProfileTitle />
          <h5 className={styles.sectionTitle}>Details</h5>
          <div className={styles.sectionDetails}>
            <div className={styles.row}>
              <div className={styles.groupPractice}>
                <GroupsFormSection
                  menuPortalTarget={document.body}
                  reduxFormChange={change}
                  groupOptions={groupOptions}
                  practiceOptions={practiceOptions}
                  changeSelectedGroupId={changeSelectedGroupId}
                  disableGroupDropdown={disableGroupDropdown}
                />
              </div>
            </div>
            <div className={styles.row}>
              <div className={styles.prefix}>
                <Label>Prefix</Label>
                <Field
                  name='prefix'
                  component={TextInput}
                />
              </div>
              <div className={styles.firstName}>
                <Label>First Name<RequiredIndicator /></Label>
                <Field
                  name='first_name'
                  component={TextInput}
                />
              </div>
              <div className={styles.lastName}>
                <Label>Last Name<RequiredIndicator /></Label>
                <Field
                  name='last_name'
                  component={TextInput}
                />
              </div>
              <div className={styles.suffix}>
                <Label>Suffix</Label>
                <Field
                  name='suffix'
                  component={TextInput}
                />
              </div>
            </div>
            <div className={styles.row}>
              <div className={styles.username}>
                <Label>Username<RequiredIndicator /></Label>
                <Field
                  name='username'
                  component={TextInput}
                  autoCapitalize='off'
                />
              </div>
              <div className={styles.email}>
                <Label>Email<RequiredIndicator /></Label>
                <Field
                  name='email'
                  component={TextInput}
                  autoCapitalize='off'
                />
              </div>
            </div>
            <div className={styles.row}>
              <div className={styles.username}>
                <Label>Display Name</Label>
                <Field
                  name='display_name'
                  component={TextInput}
                  autoCapitalize='off'
                />
              </div>
            </div>
            {
              this.newAccount &&
              <div className={styles.row}>
                <AvatarUpload onFileChosen={this.onFileChosen} />
              </div>
            }
          </div>
          {
            !this.newAccount &&
            <>
              <h5 className={styles.sectionTitle}>Password</h5>
              <div className={styles.sectionDetails}>
                {
                  isSuperUser(loggedInUser) &&
                  <div className={styles.row}>
                    <div className={styles.password}>
                      <Label>Change Password{this.newAccount && <RequiredIndicator />}</Label>
                      <Field
                        name='password'
                        component={TextInput}
                        type='password'
                      />
                    </div>
                    <div className={styles.password}>
                      <Label>Confirm Password</Label>
                      <Field
                        name='confirm_password'
                        component={TextInput}
                        type='password'
                      />
                    </div>
                  </div>
                }
                <div className={styles.row}>
                  <div className={styles.passwordResetLink}>
                    <a href='#' onClick={this.openResetModal}>Send password reset email</a>
                  </div>
                </div>
              </div>
            </>
          }
          <h5 className={styles.sectionTitle}>Communication</h5>
          <div className={styles.sectionDetails}>
            <div className={styles.row}>
              <div className={styles.accountPhone}>
                <Label>Phone</Label>
                <Field
                  name='phone'
                  component={CleaveInput}
                  format={removeUSACountryCode}
                  normalize={removeUSACountryCode}
                  placeholder='###-###-####'
                />
              </div>
              <div className={styles.timeZone}>
                <Label>Time Zone</Label>
                <Field
                  onBlur={() => true}
                  name='time_zone_pref'
                  component={SelectInput}
                  options={TIMEZONE_OPTIONS}
                  menuPortalTarget={document.body}
                />
              </div>
            </div>
          </div>
          <h5 className={styles.sectionTitle}>Roles</h5>
          <div className={styles.sectionDetails}>
            {
              <div className={styles.row}>
                <div className={styles.accountRoles}>
                  <Label>Roles</Label>
                  <Field
                    name='account_roles'
                    disabledRoles={this.isOwnAccount ? ['groupadmin'] : []}
                    component={ConnectedAccountRoleField}
                  />
                </div>
              </div>
            }
            <div className={styles.row}>
              <div className={styles.specialty}>
                <Label>Specialty</Label>
                <Field
                  name='specialty'
                  component={TextInput}
                />
              </div>
            </div>
          </div>
        </form>
        {!this.newAccount && <ResetPasswordModal size='sm' account={this.props.initialValues} close={this.closeResetModal} isOpen={this.state.isResetOpen} />}
      </>
    )
  }
}

export default reduxForm<FormValues, FormProps>({
  validate,
  enableReinitialize: true
})(UserForm)
