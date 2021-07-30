import * as React from 'react'

import { OwnProps, State } from './types'

import { ActivityFeed } from '#/components/Notifications'
import GlobalSearchMenu from './GlobalSearch'
import MainNavigation from './MainNavigation'
import MobileMenu from './MobileMenu'

export default class GlobalHeader extends React.Component<OwnProps, State> {
  state: State = {
    isClosed: true,
    isActivityFeedOpen: false,
    isSearchOpen: false,
    isMobileMenuOpen: false
  }

  showActivityFeed = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    this.setState({ isActivityFeedOpen: true })
  }

  hideActivityFeed = () => {
    this.setState({ isActivityFeedOpen: false })
  }

  showSearch = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    this.setState({ isSearchOpen: true })
  }

  hideSearch = () => {
    this.setState({ isSearchOpen: false })
  }

  toggleMobileMenu = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    this.setState({ isMobileMenuOpen: !this.state.isMobileMenuOpen })
  }

  hideMobileMenu = () => {
    this.setState({ isMobileMenuOpen: false })
  }

  toggleMainMenu = () => {
    this.setState({ isClosed: !this.state.isClosed })
  }

  /*
    written because when on '/admin-tools/manage-groups/edit-group/:groupId
    this.props.match.url === '/admin-tools' causing both the Cog and Group
    icons to be highlighted, also wanted to make the Cog is highlighted when
    on other Admin Tools pages (that do not have links in the nav)
  */
  private checkAdminToolsUrl = (menuItemUrl: string) => {
    if (menuItemUrl === '/admin-tools') {
      return this.props.match.url.includes(menuItemUrl) && !window.location.pathname.includes('edit-group')
    } else if (menuItemUrl.includes('edit-group')) {
      return window.location.pathname.includes(menuItemUrl)
    }
  }

  isActive = (menuItemUrl: string) => {
    if (menuItemUrl && menuItemUrl.includes('admin-tools')) {
      return this.checkAdminToolsUrl(menuItemUrl)
    }

    return this.props.match.url.includes(menuItemUrl)
  }

  render () {
    return (
      <>
        <GlobalSearchMenu isOpen={this.state.isSearchOpen} hideSearch={this.hideSearch} />
        <ActivityFeed isOpen={this.state.isActivityFeedOpen} hideActivityFeed={this.hideActivityFeed} />
        <MobileMenu isActive={this.isActive} isOpen={this.state.isMobileMenuOpen} hideMobileMenu={this.hideMobileMenu} />
        <MainNavigation
          isActive={this.isActive}
          showSearch={this.showSearch}
          isClosed={this.state.isClosed}
          toggleMainMenu={this.toggleMainMenu}
          toggleMobileMenu={this.toggleMobileMenu}
          showActivityFeed={this.showActivityFeed} />
      </>
    )
  }
}
