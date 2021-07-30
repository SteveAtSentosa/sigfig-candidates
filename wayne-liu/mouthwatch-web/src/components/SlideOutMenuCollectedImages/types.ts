import { } from 'redoodle'

import { CloseSideMenu } from '#/actions/media'

export interface DefaultProps {
  className: string
  overlayClassName: string
  itemListClassName: string
  menuClassName: string
  itemClassName: string
  alignRight: boolean
  actionButtonText: string
  actionButtonCallback: () => void
  isOpen: boolean
  closeMenu: () => any
  saveOnExit: boolean
  disableOverlayClick: boolean
  children?: any
}

export interface Props extends Partial<DefaultProps> {
  title: string
  _isOpen: boolean
  _closeSideMenu: typeof CloseSideMenu
}

export type StateProps = Pick<Props, '_isOpen'>
export type ActionProps = Pick<Props, '_closeSideMenu'>
export type OwnProps = Pick<Props, 'title' | 'closeMenu' | 'isOpen'>
