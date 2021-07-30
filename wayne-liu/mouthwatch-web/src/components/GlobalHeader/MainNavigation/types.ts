import { LoginResponseAccount } from '#/api'
import { RouteComponentProps } from 'react-router-dom'
import { ViewPermissions } from '#/types'

export type ActivePage =
  | 'dashboard'
  | 'patients'
  | 'tasks'
  | 'appointments'
  | 'admin-tools'
  | 'chat'
  | 'inbox'
  | 'billing'
  | 'settings'
  | 'reporting'
  | 'help-admin-legal'
  | 'my-account'

export interface OwnProps extends RouteComponentProps {
  isClosed: boolean
  activePage?: ActivePage
  toggleMainMenu: () => void
  isActive?: (url: string) => boolean
  showSearch: (e?: React.MouseEvent<HTMLAnchorElement>) => void
  showActivityFeed: (e?: React.MouseEvent<HTMLAnchorElement>) => void
  toggleMobileMenu: (e?: React.MouseEvent<HTMLAnchorElement>) => void
}

export interface StateProps {
  account: LoginResponseAccount
  token: string
  viewPerms: ViewPermissions
}

export interface State {
  isSearchOpen: boolean
  isMobileMenuOpen: boolean
  isActivityFeedOpen: boolean
  isMobileWidth: boolean
}

export type Props = OwnProps & StateProps
