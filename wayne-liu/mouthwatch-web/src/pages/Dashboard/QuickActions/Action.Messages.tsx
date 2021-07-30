import * as React from 'react'

import { Link, withRouter } from 'react-router-dom'

import { Action } from './Action.wrapper'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faComments } from '@fortawesome/pro-light-svg-icons'

const styles = require('./styles.scss')

export const Messages = withRouter(_ => (
  <Link to='/provider-chat' className={styles.actionWrapper}>
    <Action
      icon={ <FontAwesomeIcon icon={faComments} /> }
      label={'Messages'}
    />
  </Link>
))
