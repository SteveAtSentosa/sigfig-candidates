import * as React from 'react'

import { Account, Patient } from '#/types'
import { DefaultProps, Props } from './types'

import { Default } from '#/components/Avatar'
import Thumbnail from '#/components/Thumbnail'
import { User } from '#/microservice-middleware'
import cn from 'classnames'
import constructLambdaURL from '#/utils/AvatarLambdaUrl'
import { find } from 'lodash'

const styles = require('./styles.scss')
export default class AccountAvatar extends React.Component<Props> {

  static defaultProps: DefaultProps = {
    showAccountName: false,
    className: null,
    showStatusIndicator: false,
    height: 50,
    width: 50
  }

  private get account (): Account {
    const { entityId, accounts } = this.props

    return accounts && accounts[entityId]
  }

  private get patient (): Patient {
    const { entityId, patients } = this.props
    return patients.find(patient => patient.account_id === entityId)
  }

  private get avatar () {
    return this.props.avatars.find(avatar => avatar.id === this.props.entityId)
  }

  private fetchAvatar = () => {
    const { type, entityId } = this.props
    const lambdaUrl = constructLambdaURL(entityId, type)
    this.props.addAvatar({ id: entityId, lambdaUrl })
  }

  private get avatarComponent () {
    const { first_name, last_name } = this.names
    return (
        <>
          <Thumbnail className={styles.thumbnail}>{this.avatar ? this.avatar.lambdaUrl : '/static/images/transparent.png'}</Thumbnail>
          <Default firstName={first_name || ''} lastName={last_name || ''} additionalClassName={styles.avatar} />
        </>
    )
  }

  private get entity (): Patient | Account | User {
    const { chatUsers, entityId, type, patients } = this.props

    if (type === 'patient') return find(patients, { id: entityId })
    if (type === 'provider') return find(chatUsers, { accountData: { id: entityId } })

    if (this.patient) return this.patient
    if (this.account) return this.account
  }

  private get names () {
    let first_name = ''
    let last_name = ''

    if (this.entity) {
      if ('accountData' in this.entity) {
        first_name = this.entity.accountData.first_name
        last_name = this.entity.accountData.last_name
      } else {
        first_name = this.entity.first_name
        last_name = this.entity.last_name
      }
    }

    return { first_name, last_name }
  }

  private get entityName () {
    const { first_name, last_name } = this.names
    return (
      <>
        <span className={styles.first_name}>{first_name}</span>
        <span className={styles.last_name}>{last_name}</span>
      </>
    )
  }

  private get onlineIndicator () {
    const { type } = this.props
    if ('accountData' in this.entity && type === 'provider') {
      const statusClassName = cn(styles.indicator, {
        [styles.online]: this.entity && this.entity.status === 'online',
        [styles.offline]: this.entity && this.entity.status === 'offline',
        [styles.idle]: this.entity && this.entity.status === 'idle'
      })

      return <div className={statusClassName}/>
    }
  }

  private get classNames () {
    const { className } = this.props

    return cn(styles.accountAvatar, {
      [className]: className
    })
  }

  componentDidMount () {
    if (!this.avatar) {
      this.fetchAvatar()
    }
  }

  render () {
    const { showAccountName, showStatusIndicator, height, width } = this.props
    const innerClassNames = cn(styles.avatarWrapper, 'avatar-inner')

    return (
      <div className={this.classNames}>
        <div className={innerClassNames} style={{ height, width, position: 'relative' }}>
          {this.avatarComponent}
          {showStatusIndicator && this.entity && this.onlineIndicator}
        </div>
        {showAccountName && this.entityName}
      </div>
    )
  }
}
