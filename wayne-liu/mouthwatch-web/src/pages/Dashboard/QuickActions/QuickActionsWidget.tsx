import * as React from 'react'
import { ViewPermissions } from '#/types'
import { defaultActions } from './Actions'
const styles = require('./styles.scss')

interface Props {
  viewPerms: ViewPermissions
}

export default class QuickActionsWidget extends React.PureComponent<Props> {
  render () {
    const { viewPerms } = this.props

    return (
      <div className={styles.quickActionsWidget}>
        {defaultActions(viewPerms)}
      </div>
    )
  }
}
