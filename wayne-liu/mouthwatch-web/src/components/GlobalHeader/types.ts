import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { RouteComponentProps } from 'react-router-dom'

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
  activePage?: ActivePage
}

export type MenuItem = {
  name: string
  icon: IconProp
  url?: string
  newWindow?: boolean
  hideOnMobile?: boolean
  onClick?: (e?: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => void
}

export interface State {
  isClosed: boolean
  isActivityFeedOpen: boolean
  isSearchOpen: boolean
  isMobileMenuOpen: boolean
}
