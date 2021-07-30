import * as React from 'react'

import Capture from './Action.Capture'
import { ConnectedNewPatient } from './Action.NewPatient'
import EssentialTooltip from '#/components/EssentialTooltip'
import { Messages } from './Action.Messages'
import { NewAppointment } from './Action.NewAppointment'
import { ViewPermissions } from '#/types'
import { hasPermission } from '#/utils'

const styles = require('./styles.scss')

export const defaultActions = (viewPerms: ViewPermissions) => [
  <ConnectedNewPatient key='patient' />,
  <EssentialTooltip
    wrapperClassName={styles.actionWrapper}
    enabled={!hasPermission(viewPerms, 'capture')}
    content={<span><strong>Capture images and video</strong> during appointments, then add directly to the appointment record.</span>}
  >
    <Capture key='capture'/>
  </EssentialTooltip>,
  <NewAppointment key='appointment' />,
  <Messages key='messages' />
]
