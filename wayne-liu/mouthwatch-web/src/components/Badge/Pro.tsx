import Badge from './Badge'
import { ProBadgeProps } from './types'
import React from 'react'

const ProBadge: React.FC<ProBadgeProps> = (props) => (
  <Badge badgeContent='PRO' color='#09CCE2' {...props} />
)

export default ProBadge
