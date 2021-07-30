import * as React from 'react'

import { faBookOpen, faCalendarDay, faCog, faColumns, faComment, faQuestionCircle, faSignOut, faTasks, faUserFriends } from '@fortawesome/pro-light-svg-icons'

import AccountAvatar from '#/components/AccountAvatar'
import { AppState } from '#/redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Link } from 'react-router-dom'
import { LoginResponseAccount, linkForLMSSSO } from '#/api'
import { MenuItem } from '#/components/GlobalHeader/types'
import SubMenu from '#/components/GlobalHeader/SubMenu'
import cn from 'classnames'
import { connect } from 'react-redux'
import { getAuthToken } from '#/actions/auth.selectors'
import { isSuperUser } from '#/utils'

const styles = require('./styles.scss')

interface OwnProps {
  isOpen: boolean
  hideMobileMenu: () => void
  isActive?: (url: string) => boolean
}

interface StateProps {
  account: LoginResponseAccount
  accountId: string
  token: string
}

type Props = OwnProps & StateProps

class MobileMenu extends React.PureComponent<Props> {

  private get isSuperUser () {
    return isSuperUser(this.props.account)
  }

  private get isPatient () {
    const { account } = this.props
    return account && account.is_patient
  }

  private get mainMenuItems (): MenuItem[] {
    if (this.isPatient) return [{ name: 'Messaging', icon: faComment, url: '/patient-chat' }]
    if (this.isSuperUser) return this.superAdminMainMenuItems
    return [
      { name: 'Dashboard', icon: faColumns, url: '/dashboard' },
      { name: 'Patients', icon: faUserFriends, url: '/patients' },
      { name: 'Appointments', icon: faCalendarDay, url: '/appointments' },
      { name: 'Tasks', icon: faTasks, url: '/tasks' },
      { name: 'Messaging', icon: faComment, url: '/provider-chat' },
      { name: 'Admin', icon: faCog, url: '/admin-tools', hideOnMobile: true },
      { name: 'Learning Center', icon: faBookOpen, onClick: this.openLMS },
      { name: 'Help', icon: faQuestionCircle, url: '/help-and-legal', newWindow: true }
    ]
  }

  private get superAdminMainMenuItems (): MenuItem[] {
    return [
      { name: 'Admin', icon: faCog, url: '/admin-tools' },
      { name: 'Logout', icon: faSignOut, url: '/logout' }
    ]
  }

  private openLMS = async () => {
    try {
      const res = await linkForLMSSSO(this.props.token)()
      window.open(res.redirectUrl)
    } catch (err) {
      console.error(err)
    }
  }

  private getNavItemClassName = (hideOnMobile: boolean, url: string) => {
    const { isActive } = this.props
    return cn(styles.navItem, {
      [styles.hidden]: hideOnMobile,
      [styles.isActive]: isActive && isActive(url)
    })
  }

  private renderButtons = (menuItems: MenuItem[]) => {
    return menuItems.map(item => (
      <button className={this.getNavItemClassName(item.hideOnMobile, item.url)} title={item.name} key={item.name} onClick={item.onClick}>
        <Link to={item.url || '#'} target={item.newWindow ? '_blank' : '_self' } onClick={this.props.hideMobileMenu}>
          <div className={styles.icon}><FontAwesomeIcon icon={item.icon} /></div>
          <span className={styles.text}>{item.name}</span>
        </Link>
      </button>
    ))
  }

  private renderLogo = () => (
    <button className={styles.navItem} title={'TeleDent'}>
      <Link to='/dashboard' onClick={this.props.hideMobileMenu}>
        <div className={styles.icon}><img src='/static/images/logo_badge.png' alt='Teledent Logo Badge' /></div>
        <span className={styles.text}><img src='/static/images/logo_text.png' alt='Teledent Logo Text' /></span>
      </Link>
    </button>
  )

  private renderMyAccountButton = () => (
    !this.isSuperUser &&
    <button className={styles.navItem} title={'My Account'}>
      <Link to='/my-account' onClick={this.props.hideMobileMenu}>
        <div className={styles.icon}><AccountAvatar type='provider' entityId={this.props.accountId} height={25} width={25} className={styles.avatar} /></div>
        <span className={styles.text}>My Account</span>
      </Link>
    </button>
  )

  render () {
    return (
      <SubMenu
        closeFunction={this.props.hideMobileMenu}
        isOpen={this.props.isOpen}
        menuClassName={styles.menuClassName}
      >
        <header className={styles.mobileMenu}>
          <div className={styles.logo}>
            {this.renderLogo()}
          </div>
          <div className={styles.main}>
            {this.renderButtons(this.mainMenuItems)}
            {this.renderMyAccountButton()}
          </div>
        </header>
      </SubMenu>
    )
  }
}

export default connect<StateProps, {}, OwnProps>(
  (state: AppState) => {
    return {
      account: state.auth.data.account,
      accountId: state.auth.data.account.id,
      token: getAuthToken(state)
    }
  }
)(MobileMenu)
