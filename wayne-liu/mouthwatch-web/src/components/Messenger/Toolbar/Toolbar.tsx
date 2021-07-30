import * as React from 'react'

import { DefaultProps, Props } from './types'

import { ConnectedUpgradeBadge } from '#/components/Badge'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Link } from 'react-router-dom'
import SearchBar from '../SearchBar/SearchBar'
import cn from 'classnames'
import config from '#/config'
import { faVideo } from '@fortawesome/pro-light-svg-icons'
import { getNameForChat } from '#/utils/Chat'
import { showUpgradeBadge } from '#/utils'

const styles = require('./styles.scss')

class Toolbar extends React.PureComponent<Props> {

  static defaultProps: DefaultProps = {
    className:  null
  }

  private get renderVideoButton () {
    const { loggedInUser, channel } = this.props
    return (
      !loggedInUser.is_patient && !channel.readOnly &&
      <div className={styles.third}>
        <div className={styles.videoMessage} onClick={this.initiateVideoConference}>
          <FontAwesomeIcon icon={faVideo}/>
          <p>Call</p>
        </div>
      </div>
    )
  }

  private get renderUpgradeBadge () {
    const { viewPerms } = this.props

    return showUpgradeBadge(viewPerms, ['group_messaging', 'video_audio_messages', 'browser_media_upload']) &&
      <ConnectedUpgradeBadge badgeClassName={styles.upgradeBadge} />
  }

  private get renderPatientDetails () {
    const { first_name, last_name, patient_id: patientId, dob, email } = this.patientInUsersToChannel.accountData

    return (
      <div className={styles.patientDetails}>
        <div className={styles.first}>
          <div className={styles.name}>
            {`${first_name} ${last_name}`}
          </div>
          <div className={styles.dob}>
            <span>DOB:</span><span>{dob}</span>
          </div>
        </div>
        <div className={styles.second}>
          <Link className={styles.record} to={`/patients/detail/${patientId}`}>View Patient Record</Link>
          <div className={styles.email}>
            <span>EMAIL:</span><span>{`${email}`}</span>
          </div>
        </div>
        {this.renderUpgradeBadge}
        {this.renderVideoButton}
      </div>
    )
  }

  private get renderProviderDetails () {
    const { loggedInUser, channel } = this.props
    const accountNames = channel.userToChannels
      .filter(u => u.userId !== loggedInUser.id)
      .map((u) => {
        return getNameForChat(u.accountData, loggedInUser.is_patient, true)
      })
    return (
      <div className={styles.providerToolbar}>
        <div className={styles.channelNames}>
          {accountNames.join(', ')}
        </div>
        {this.renderUpgradeBadge}
        {this.renderVideoButton}
      </div>
    )
  }

  private get patientInUsersToChannel () {
    return this.props.channel.userToChannels.find(uC => uC.accountData.is_patient)
  }

  private get shouldRenderProviderDetails () {
    const { loggedInUser } = this.props
    return loggedInUser.is_patient || !this.patientInUsersToChannel
  }

  private get className () {
    const { className } = this.props
    return cn(styles.toolbar, {
      [className]: true
    })
  }

  // NOTE: This isn't being used at the moment. I've left i here for when it does get implemented.
  get renderSearch () {
    return (
      <div className={styles.search}>
        { config.features.messageSearch && <SearchBar placeholder='Search messages...' form='messages' type='messages'/> }
      </div>
    )
  }

  private initiateVideoConference = (_event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const { channel: { userToChannels }, createVideoSession, loggedInUser, selectedChannel } = this.props
    const userIds = []
    userToChannels.forEach(user => {
      const userId = user.userId
      // we don't need to add the user who created the video conference to the video conference
      if (userId !== loggedInUser.id) {
        userIds.push(userId)
      }
    })
    createVideoSession({ participants: userIds, autoLogin: true, channelId: selectedChannel })
  }

  render () {
    const { channel } = this.props
    if (!channel) return null
    return (
        <nav className={this.className}>
          { this.shouldRenderProviderDetails ? this.renderProviderDetails : this.renderPatientDetails }
        </nav>
    )
  }

}

export default Toolbar
