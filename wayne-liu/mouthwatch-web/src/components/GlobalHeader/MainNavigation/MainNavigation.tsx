import * as React from 'react'

import { Link, withRouter } from 'react-router-dom'
import { OwnProps, State, StateProps } from './types'
import { faAngleDoubleLeft, faAngleDoubleRight, faBars, faBookOpen, faCalendarDay, faCog, faColumns, faComment, faQuestionCircle, faSearch, faSignOut, faTasks, faUserFriends } from '@fortawesome/pro-light-svg-icons'
import { getAuthAccount, getAuthToken } from '#/actions/auth.selectors'
import { isGroupAdmin, isSuperUser } from '#/utils'

import AccountAvatar from '#/components/AccountAvatar'
import { AppState } from '#/redux'
import { BREAKPOINT_BS_SM } from '#/consts'
import ChatField from '#/components/Messenger/ChatField'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import GlobalHeaderQuickCreate from './GlobalHeaderQuickCreate'
import { MenuItem } from '#/components/GlobalHeader/types'
import NotificationBell from '#/components/Notifications'
import cn from 'classnames'
import { connect } from 'react-redux'
import { linkForLMSSSO } from '#/api/auth'

const styles = require('./styles.scss')

class MainNavigation extends React.Component<OwnProps & StateProps, State> {
  state: State = {
    isActivityFeedOpen: false,
    isSearchOpen: false,
    isMobileMenuOpen: false,
    isMobileWidth: window.innerWidth <= BREAKPOINT_BS_SM
  }

  componentDidMount () {
    window.addEventListener('resize', this.setIsMobileWidth)
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.setIsMobileWidth)
  }

  private get isSuperUser () {
    return isSuperUser(this.props.account)
  }

  private get isGroupAdmin () {
    return isGroupAdmin(this.props.account)
  }

  private get headerClassNames () {
    return cn(styles.header, {
      [styles.isClosed]: this.props.isClosed
    })
  }

  private get mainMenuItems (): MenuItem[] {
    if (this.isSuperUser) return []
    return [
      { name: 'Dashboard', icon: faColumns, url: '/dashboard' },
      { name: 'Patients', icon: faUserFriends, url: '/patients' },
      { name: 'Appointments', icon: faCalendarDay, url: '/appointments' },
      { name: 'Tasks', icon: faTasks, url: '/tasks' },
      { name: 'Messaging', icon: faComment, url: '/provider-chat' }
    ]
  }

  private get secondaryMenuItems (): MenuItem[] {
    if (this.isSuperUser) return this.superAdminSecondaryMenuItems
    if (this.isGroupAdmin) return this.groupAdminSecondaryMenuItems
    return [
      { name: 'Search', icon: faSearch, onClick: this.props.showSearch },
      { name: 'Help', icon: faQuestionCircle, url: '/help-and-legal' }
    ]
  }

  private get superAdminSecondaryMenuItems (): MenuItem[] {
    return [
      { name: 'Admin', icon: faCog, url: '/admin-tools' },
      { name: 'Logout', icon: faSignOut, url: '/logout' }
    ]
  }

  private get groupAdminSecondaryMenuItems (): MenuItem[] {
    const items = [
      { name: 'Search', icon: faSearch, onClick: this.props.showSearch },
      { name: 'Admin', icon: faCog, url: '/admin-tools' },
      { name: 'Help', icon: faQuestionCircle, url: '/help-and-legal', newWindow: true }
    ]

    if (!this.state.isMobileWidth) {
      items.push({ name: 'Learning Center', icon: faBookOpen, onClick: this.openLMS })
    }

    return items
  }

  private getNavItemClassName = (url: string) => {
    const { isActive } = this.props
    return cn(styles.navItem, {
      [styles.isActive]: isActive && isActive(url)
    })
  }

  private renderButtons = (menuItems: MenuItem[]) => {
    return menuItems.map(item => (
        <button className={this.getNavItemClassName(item.url)} title={item.name} key={item.name}>
          <Link to={item.url || '#'} target={item.newWindow ? '_blank' : '_self' } onClick={item.onClick && item.onClick}>
            <div className={styles.icon}><FontAwesomeIcon icon={item.icon} /></div>
            <span className={styles.text}>{item.name}</span>
          </Link>
        </button>
    ))
  }

  private renderLogo = () => {
    return (
      <button className={styles.navItem} title={'TeleDent'}>
        <Link to='/dashboard'>
          <div><img className={styles.icon} src='/static/images/logo_badge.png' alt='Teledent Logo Badge' /></div>
          <span className={styles.text}><img src='/static/images/logo_text.png' alt='Teledent Logo Text' /></span>
        </Link>
      </button>
    )
  }

  private renderQuickCreate = () => (
    (!this.isSuperUser) && <GlobalHeaderQuickCreate accountId={this.props.account.id} viewPerms={this.props.viewPerms} />
  )

  private renderNotificationBell = () => (
    !this.isSuperUser &&
    <button className={styles.navItem} title={'Notifications'}>
      <Link to='#' onClick={this.props.showActivityFeed}>
        <div className={styles.icon}><NotificationBell iconSize='1x' /></div>
        <span className={styles.text}>Notifications</span>
      </Link>
    </button>
  )

  private renderMyAccountButton = () => (
    !this.isSuperUser &&
    <button className={styles.navItem} title={'My Account'}>
      <Link to={'/my-account'}>
        <div className={styles.icon}><AccountAvatar type='provider' entityId={this.props.account.id} height={30} width={30} className={styles.avatar} /></div>
        <span className={styles.text}>My Account</span>
      </Link>
    </button>
  )

  private renderMobileMenuButton = () => (
    <button className={styles.navItem} title={'Menu'}>
      <Link to='#' onClick={this.props.toggleMobileMenu}>
        <div className={styles.icon}><FontAwesomeIcon icon={faBars} /></div>
        <span className={styles.text}>Menu</span>
      </Link>
    </button>
  )

  private renderToggleButton = () => {
    return (
      <div className={styles.toggle} onClick={this.props.toggleMainMenu} title={this.props.isClosed ? 'Open Menu' : 'Close Menu'}>
        <FontAwesomeIcon icon={this.props.isClosed ? faAngleDoubleRight : faAngleDoubleLeft} />
      </div>
    )
  }

  private openLMS = async () => {
    try {
      const res = await linkForLMSSSO(this.props.token)()
      window.open(res.redirectUrl)
    } catch (err) {
      console.error(err)
    }
  }

  setIsMobileWidth = () => {
    this.setState({
      isMobileWidth: window.innerWidth <= BREAKPOINT_BS_SM
    })
  }

  render () {
    return (
      <header className={this.headerClassNames}>
        {this.renderToggleButton()}
        <div className={styles.chatfieldContainer}><ChatField /></div>
        <div className={styles.headerContent}>
          <div className={styles.logo}>
            {this.renderLogo()}
          </div>
          <div className={styles.main}>
            <div className={styles.menuContent}>
              {this.renderQuickCreate()}
              {this.renderButtons(this.mainMenuItems)}
            </div>
          </div>
          <div className={styles.secondary}>
            <div className={styles.menuContent}>
              {this.renderButtons(this.secondaryMenuItems)}
              {this.renderQuickCreate()}
              {this.renderNotificationBell()}
              {this.renderMobileMenuButton()}
              {this.renderMyAccountButton()}
            </div>
          </div>
        </div>
      </header>
    )
  }
}

export default withRouter(connect<StateProps, {}, OwnProps>(
  (state: AppState) => {
    return {
      account: getAuthAccount(state),
      token: getAuthToken(state),
      viewPerms: state.ui.permissions
    }
  }
)(MainNavigation))
