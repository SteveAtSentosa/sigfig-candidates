import * as React from 'react'

import AccountAvatar from '#/components/AccountAvatar'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { HeaderOptions } from '#/components/MessageBox/types'
import MessageBox from '#/components/MessageBox'
import { Props } from './types'
import ProviderList from './ProviderList'
import { faEllipsisH } from '@fortawesome/pro-regular-svg-icons'

const styles = require('./styles.scss')

class CommunicationList extends React.PureComponent<Props> {

  private get headerOption (): HeaderOptions {
    return {
      leftSlot: () => <AccountAvatar height={25} width={25} showStatusIndicator type='provider' entityId={this.props.loggedInAccount.id}/>,
      middleSlot: () => <>{'My Communications'}<span className={styles.notificationCount}><p>1</p></span></>,
      rightSlot: () => <FontAwesomeIcon className={styles.ellipseIcon} icon={faEllipsisH} />
    }
  }

  private handleCommunicationListClick = (_event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const { controlCommunicationList, viewState } = this.props
    const newViewState = viewState === 'collapsed' ? 'open' : 'close'
    controlCommunicationList(newViewState)
  }

  private get isCollapsed () {
    return this.props.viewState === 'collapsed'
  }

  render () {
    return (
      <div className={styles.communicationList}>
        <MessageBox onHeaderClick={this.handleCommunicationListClick} size='lg' header={this.headerOption} collapsed={this.isCollapsed}>
          <ProviderList form='providerList' />
        </MessageBox>
      </div>
    )
  }
}

export default CommunicationList
