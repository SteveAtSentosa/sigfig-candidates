import React from 'react'

export type Props = {
  badgeContent: React.ReactNode
  badgeClassName?: string
  wrapperClassName?: string
  children?: React.ReactNode
  color?: string
  anchorOrigin?: { horizontal: 'left' | 'right', vertical: 'top' | 'bottom' }
  onClick?: (ev: React.MouseEvent | React.TouchEvent) => void
}

export type ProBadgeProps = Omit<Props, 'badgeContent' | 'color'>

export type UpgradeBadgeProps = {
  badgeClassName?: string
  wrapperClassName?: string
  children?: React.ReactNode
  anchorOrigin?: Props['anchorOrigin']
}

export type UpgradeLinkProps = Pick<Props, 'onClick'> & {
  copy: string
  float?: 'right' | 'left'
}
