import * as React from 'react'

import { RouteComponentProps, withRouter } from 'react-router-dom'

import { Group } from '#/types'
import { LogoPreview } from './LogoUpload'
import { getLambdaGroupLogoSrc } from '#/utils'

const styles = require('./styles.scss')

interface Props extends RouteComponentProps {
  group: Group
  showLink: boolean
}

class AccountEditPreview extends React.PureComponent<Props> {
  onClick = () => {
    const { group: { id } } = this.props
    this.props.history.push(`/admin-tools/manage-accounts/edit-account/${id}`)
  }

  render () {
    const { group: { id, group_logo }, showLink } = this.props
    return (
      <div className={styles.groupEditPreview}>
        {
          group_logo &&
          <div className={styles.groupLogo}>
            <LogoPreview src={getLambdaGroupLogoSrc(id)} />
          </div>
        }
        <div className={styles.groupName}>
          <h5>{name}</h5>
          { showLink && <a href='#' onClick={this.onClick}>View and Edit Account Details</a>}
        </div>
      </div>
    )
  }
}

export default withRouter(AccountEditPreview)
