import * as React from 'react'

import { NavLink, RouteComponentProps, match, withRouter } from 'react-router-dom'

import { Location } from 'history'
import { ProBadge } from '../Badge'
import cn from 'classnames'

const styles = require('./styles.scss')

export interface TabConfig {
  url: string
  text: string
  showProBadge?: boolean
  isActive?: (match: match, location: Location) => boolean
}

interface Props {
  tabs: TabConfig[]
  forMobile?: boolean
  tabClassName?: string
  menuClassName?: string
  activeClassName?: string
  noDefaultActive?: boolean
  activeTabClassName?: string
}

class TabMenu extends React.PureComponent<Props & RouteComponentProps> {

  private get menuClassNames () {
    const { forMobile, menuClassName } = this.props

    return cn({
      [menuClassName]: menuClassName,
      ['menu']: !forMobile,
      [styles.mobileMenu]: forMobile,
      [styles.menu]: !forMobile
    })
  }

  private activeTabClassName = (path: string) => {
    const { location, tabClassName, activeTabClassName } = this.props
    return !(location.pathname === path) ? tabClassName : tabClassName + ' ' + activeTabClassName
  }

  private renderTab = (tab: TabConfig, i: number) => {
    const { activeClassName, noDefaultActive } = this.props
    return (
        <li key={i} className={this.activeTabClassName(tab.url)}>
          <NavLink exact to={{ pathname: tab.url, state: { link: tab.text } }} isActive={tab.isActive} className={styles.item} activeClassName={(noDefaultActive || styles.active) + ' ' + activeClassName}>
            <span>{tab.text}</span>
            { tab.showProBadge && <ProBadge badgeClassName={styles.proBadge} /> }
          </NavLink>
        </li>
    )
  }

  render () {
    return (
      <div className={this.menuClassNames}>
        <ul>
          {this.props.tabs.map(this.renderTab)}
        </ul>
      </div>
    )
  }

}

export default withRouter(TabMenu)
