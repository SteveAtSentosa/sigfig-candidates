import * as React from 'react'

import { ConnectedUpgradeLink } from '#/components/Badge'
import { Heading7 as Heading } from '#/components/Heading'
import cn from 'classnames'

const styles = require('./styles.scss')

interface Props {
  children: {
    title: string
    widget: React.ReactNode
    className?: string
    submenu?: React.ReactNode
  }
  disabled?: boolean
}

export default class WidgetContainer extends React.Component<Props> {
  get className () {
    const { children: { className }, disabled } = this.props

    return cn(
      'widget',
      {
        [styles.disabled]: disabled,
        [styles[className]]: !!className
      }
    )
  }

  render () {
    const { children: { title, submenu, widget }, disabled } = this.props

    return (
      <div className={styles.widgetWrapper}>
        <div className={this.className}>
          <div className={styles.title}>
            <div className={styles.heading}><Heading>{title}</Heading></div>
            <div className={styles.submenu}>{ submenu ? submenu : null }</div>
          </div>
          <div className={styles.content}>
            { widget }
          </div>
        </div>
        { disabled && <ConnectedUpgradeLink copy={`use ${title.toLowerCase()}`} /> }
      </div>
    )
  }
}
