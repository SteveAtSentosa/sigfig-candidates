import * as React from 'react'

import { ConnectedUpgradeLink } from '#/components/Badge'
import Loader from '../Loader'
import cn from 'classnames'

const styles = require('./styles.scss')

interface Props {
  children: React.ReactNode
  title: string
  action?: React.ReactNode
  hideButton?: boolean
  loading?: boolean
  disabled?: boolean
}

interface State {
  open: boolean
}

export default class CollapsibleSection extends React.Component<Props, State> {
  state: State = {
    open: true
  }

  toggle = () => {
    this.setState({
      open: !this.state.open
    })
  }

  render () {
    const { children, title, action, hideButton, loading, disabled } = this.props
    const { open } = this.state
    const bodyClass = open ? styles.opened : styles.closed

    return (
      <>
      <div className={cn(styles.collapsible, { [styles.disabled]: disabled })}>
        <div className={styles.header}>
          <span className={styles.title}>{title}</span>
          { loading && <span><Loader className={styles.noPadding} size={20} color='#ffffff' /></span> }
          <div>
          {
            !hideButton &&
            <span className={styles.close}>
              <button type='button' onClick={this.toggle}>{open ? '–' : '+'}</button>
            </span>
          }
          {
            action &&
            <span className={styles.close}>
              {action}
            </span>
          }
          </div>
        </div>
        <div className={`${styles.body} ${bodyClass}`}>
          {children}
        </div>
      </div>
      { disabled && <ConnectedUpgradeLink copy={`use ${title.toLowerCase()}`} />}
      </>
    )
  }

}
