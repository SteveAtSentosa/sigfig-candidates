import { UpgradeBadgeProps, UpgradeLinkProps } from './types'

import Badge from './Badge'
import React from 'react'
import { UpgradeSubscriptionContainer } from '../EssentialModal'
import cn from 'classnames'

const styles = require('./styles.scss')

const UpgradeBadge: React.FC<UpgradeBadgeProps> = (props) => {
  return (
    <Badge badgeContent='Upgrade Now' color='#09CCE2' {...props} />
  )
}

const UpgradeLink: React.FC<UpgradeLinkProps> = (props) => {
  const className = cn(
    styles.upgradeLink,
    {
      [styles.right]: props.float === 'right',
      [styles.left]: props.float === 'left'
    }
  )

  return (
    <span className={className} onClick={props.onClick}>Upgrade to {props.copy}</span>
  )
}

UpgradeLink.defaultProps = {
  float: 'right'
}

export const ConnectedUpgradeBadge: React.FC<UpgradeBadgeProps> = (props) => {
  return (
    <UpgradeSubscriptionContainer>
      <UpgradeBadge {...props} />
    </UpgradeSubscriptionContainer>
  )
}

export const ConnectedUpgradeLink: React.FC<UpgradeLinkProps> = (props) => {
  return (
    <UpgradeSubscriptionContainer>
      <UpgradeLink {...props} />
    </UpgradeSubscriptionContainer>
  )
}
