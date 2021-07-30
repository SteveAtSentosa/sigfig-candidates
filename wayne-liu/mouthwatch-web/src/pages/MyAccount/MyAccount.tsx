import * as React from 'react'

import { Account, Option } from '#/types'
import { ActionProps, State, StateProps } from './types'
import { AvatarOptions, Default } from '#/components/Avatar'
import { ChangePasswordForm, FormProps as ChangePasswordFormProps, ChangePasswordIFormData, MyAccountMedia, Profile } from '#/components/MyAccount'
import { DataURLToFile, getLambdaMediaSrc } from '#/utils'
import { Link, Route, RouteComponentProps, Switch } from 'react-router-dom'
import { MyAccountForm, IFormData as MyAccountFormData, Props as MyAccountFormProps } from '#/components/Form/MyAccount'
import SMSOptIn, { FormData as SMSFormData, FormProps as SMSFormProps } from '#/components/MyAccount/SMSOptIn'
import TabMenu, { TabConfig } from '#/components/TabMenu'
import { isEqual, mapValues, omitBy, pick } from 'lodash'

import Button from '#/components/Button'
import { ConnectSocialMedia } from '#/components/SocialMediaLogin'
import Container from '#/components/Container'
import { DisplayFileInputImage } from '#/components/Avatar/FileInput'
import { FormSubmitHandler } from 'redux-form'
import { Loads } from '#/components/Loader'
import Page from '#/components/Page'
import { PatchedEntity } from '#/api'
import PopperWorkspace from '#/components/PopperWorkspace'
import UnsavedChanges from '#/components/UnsavedChanges'
import cn from 'classnames'
import config from '#/config'

const styles = require('./styles.scss')

type Props = StateProps & ActionProps & RouteComponentProps
export default class MyAccount extends React.PureComponent<Props, State> {
  state: State = {
    showSaveBtn: false
  }

  editImageButtonRef = React.createRef<HTMLButtonElement>()
  editImageMenuRef = React.createRef<typeof PopperWorkspace>()

  tabs: TabConfig[] = [
    {
      text: 'Profile',
      url: '/my-account'
    },
    {
      text: 'Password',
      url: '/my-account/change-password'
    },
    {
      text: 'Media',
      url: '/my-account/media'
    },
    {
      text: 'Notifications',
      url: '/my-account/notification-settings'
    }
  ]

  private getTabs = () => {
    const { account: { is_patient } } = this.props

    // only show the media tab if the account is NOT a patient
    if (is_patient) {
      return this.tabs.filter(tab => tab.text !== 'Media')
    }

    return this.tabs
  }

  formKeys = ['username', 'prefix', 'first_name', 'middle_name', 'last_name', 'suffix', 'phone', 'email', 'specialty', 'time_zone_pref', 'display_name']

  private handlePasswordChange: FormSubmitHandler<ChangePasswordIFormData, ChangePasswordFormProps> = (values) => {
    const { new_password } = values
    const { changePassword, account } = this.props
    changePassword({
      id: account.id,
      newPassword: new_password,
      updated_at: account && account.updated_at
    })
  }

  private handleSMSOptIn: FormSubmitHandler<SMSFormData, SMSFormProps> = (values) => {
    const { send_text_alerts, phone } = values
    const { updateSMSOptStatus } = this.props

    updateSMSOptStatus({
      sms_opt_in: send_text_alerts,
      phone: send_text_alerts ? phone : undefined
    })
  }

  private handleOnSubmit: FormSubmitHandler<MyAccountFormData, MyAccountFormProps> = (values, _dispatch, formProps) => {
    /*
      Filter out only the form data that has changed.
      Then compare old form data to new form data to see HOW it's changed
      ( Did it never exist and are you adding it? Are you replacing it? Or are you removing it? )
    */
    const { initialValues } = formProps
    const { accountId, account } = this.props
    /* TODO: Might want to extract this to utils? To be used elsewhere? (@Jason Lalor) */
    const difference: Partial<Account> = omitBy(values, (value, key) => isEqual(value, initialValues[key])) as unknown as Account
    const updatedValuesOnly: PatchedEntity = mapValues(difference, (value: Option | string, key: string) => {
      const op: 'add' | 'replace' | 'remove' = initialValues[key] && !value ? 'remove' : value && !initialValues[key] ? 'add' : 'replace'
      /*
        Check if value has a nested value (it's an object) extract that value from it. If not just send the value as is.
        Additionally, service does not accept a value if the operation is remove. Reason for gaurd.
      */
      return op === 'remove' ? { op } : { value: (value as Option).value || value, op }
    })

    this.props.updateAccount({ id: accountId, data: updatedValuesOnly, me: true, updated_at: account && account.updated_at, after: this.redirect })
  }

  private redirect = () => {
    this.props.history.push('/my-account')
  }

  private openEditImageMenu = () => {
    this.editImageMenuRef.current.show()
  }

  private closeEditImageMenu = () => {
    this.editImageMenuRef.current.hide()
  }

  private setDefaultAvatar = (accountId: string) => () => {
    /*
      If there are multiple acct-avatars remove them.
    */
    this.props.setDefaultAvatar({ accountId })
    this.closeEditImageMenu()
  }

  private updateAccountAvatar = (imageData: any) => {
    const { account, updateAccount } = this.props
    const updatedAccount: PatchedEntity = { picture: { value: DataURLToFile(imageData), op: 'add' } }
    updateAccount({ id: account.id, data: updatedAccount, updated_at: account && account.updated_at })
    this.closeEditImageMenu()
  }

  private get formattedAccount (): Partial<MyAccountFormData> {
    /*
      Remove any properties that the form will not use. This gets fed to initialValues.
      Having unnecessary properties causes extra computation that is not needed.
    */

    const account = pick(this.props.account, this.formKeys)

    return account.time_zone_pref
      ? { ...account, time_zone_pref: { label: account.time_zone_pref, value: account.time_zone_pref } } as unknown as Partial<MyAccountFormData>
      : account as unknown as Partial<MyAccountFormData>
  }

  componentDidMount () {
    this.fetchAccount()
  }

  private fetchAccount = () => {
    this.props.getAccount({ id: this.props.accountId })
  }

  private get avatarMedia () {
    const { account } = this.props
    return account && account.media &&
      account.media
        .filter(m => m.type === 'acct-avatar')
        .sort((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at))[0] || undefined
  }

  private renderHeader = (account: Account) => {
    const { prefix, suffix, first_name, middle_name, last_name } = account
    const { authToken } = this.props
    const isPatient = account.is_patient
    return (
        <div className={styles.header}>
          <div className={styles.avatarWithEditPhoto}>
            {
              !this.avatarMedia ?
              <Default firstName={first_name} lastName={last_name}/> :
              <DisplayFileInputImage src={getLambdaMediaSrc(this.avatarMedia.id, authToken)}/>
            }
            {
              !isPatient &&
              <div className={styles.editLink}>
                <button style={{ padding: '0px' }} onClick={this.openEditImageMenu} ref={this.editImageButtonRef}>Edit Photo</button>
                <PopperWorkspace
                  flexWidth
                  offset='0,0'
                  targetRef={this.editImageButtonRef}
                  ref={this.editImageMenuRef}
                  clickOffCb={this.closeEditImageMenu}
                >
                  <AvatarOptions onDefault={this.setDefaultAvatar(account.id)} onFile={this.updateAccountAvatar} onWebcam={this.updateAccountAvatar} />
                </PopperWorkspace>
              </div>
            }
          </div>
          <div className={styles.profileHeader}>
            <div className={styles.profileName}>
              <h3>{`${prefix || ''} ${first_name || ''} ${middle_name || ''} ${last_name || ''} ${suffix || ''}`}</h3>
            </div>
            { !isPatient && <Link to='/my-account/edit-profile'>Edit Profile</Link>}
          </div>
        </div>
    )
  }

  private onFormChange = () => {
    this.setState({ showSaveBtn: true })
  }

  renderRoutes = (account: Account) => {
    return (<div>
      <Switch>
        <Route exact path='/my-account/edit-profile' render={() =>
          <>
            <UnsavedChanges formName='userEdit' />
            <MyAccountForm
              form='userEdit'
              account={account}
              onChange={this.onFormChange}
              onSubmit={this.handleOnSubmit}
              initialValues={this.formattedAccount}
            />
          </>
        }/>
        <Route exact path='/my-account/change-password' render={() => <ChangePasswordForm onChange={this.onFormChange} onSubmit={this.handlePasswordChange} username={account.username} form='change_password' />}/>
        <Route exact path='/my-account/media' render={() => <MyAccountMedia />}/>
        <Route exact path='/my-account/notification-settings' render={() =>
          <SMSOptIn
            smsOptIn={account.sms_opt_in}
            onSubmit={this.handleSMSOptIn}
            initialValues={{ phone: account.phone }}
          />
        }/>
        <Route render={() =>
          <>
            { (config.features.socialLogin && account.is_patient) && <ConnectSocialMedia />}
            <Profile account={account} />
            <Link to='/logout' className={styles.logoutLink}>Logout</Link>
          </>
        }/>
      </Switch>
    </div>)
  }

  // make sure the activeForm name is one of the ones on MyAccount page
  private checkIfMyAccountFormName = (formName: string) => {
    const myAccountFormNames = ['accountEdit', 'change_password', 'updateTextAlerts']
    return myAccountFormNames.includes(formName)
  }

  private get activeMyAccountFormName () {
    const { activeFormNames } = this.props

    if (!activeFormNames.length) {
      return ''
    }

    const matches = activeFormNames.filter(f => this.checkIfMyAccountFormName(f))
    return matches[0]
  }

  render () {
    const { account, saving, fetching, deleting } = this.props
    const loading = fetching || saving || deleting || !(account) || !('media' in account) || !('groups' in account)

    return (
      <Page title='My Account'>
        <Container flex grow fullWidth patientHeader={account && account.is_patient}>
          <Loads when={!loading}>
            {
              () =>
              <div className={styles.myAccount}>
                {this.renderHeader(account)}
                <TabMenu tabs={this.getTabs()} menuClassName={cn(styles.menuOverride, { [styles.forPatient]: account && account.is_patient })} tabClassName={styles.tabs} activeClassName={styles.activeTab} />
                {this.renderRoutes(account)}
                { this.activeMyAccountFormName && this.state.showSaveBtn &&
                  <div className={styles.save_button_area}>
                    <Button skinnyBtn submit form={this.activeMyAccountFormName}>Save</Button>
                  </div>
                }
              </div>
            }
          </Loads>
        </Container>
      </Page>
    )
  }
}
