import * as React from 'react'

import { DefaultProps, Props } from './types'

import cn from 'classnames'

const styles = require('./styles.scss')

export default class extends React.PureComponent<Props> {
  static defaultProps: DefaultProps = {
    className: '',
    website: 'TeleDent'
  }

  componentDidUpdate () {
    document.title = `${this.props.website} - ${this.props.title}`
  }

  private get className () {
    return cn('page', styles.page, {
      [this.props.className] : this.props.className
    })
  }

  private handleClick = () => {
    const { setStatus, title, isSuperAdmin } = this.props
    if (title === 'Login' || title === 'Logout' || title === 'Patient Registration' || title === 'Reset Password' || title === 'Forgot Password' || title === 'Account Setup' || title === 'Patient Login' || isSuperAdmin) return
    setStatus()
  }

  render () {
    return (
      <div className={this.className} onClick={this.handleClick}>
        {this.props.children}
      </div>
    )
  }
}
