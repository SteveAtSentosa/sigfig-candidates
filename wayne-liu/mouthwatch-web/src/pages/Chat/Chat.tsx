import * as React from 'react'

import Messenger, { MessengerList } from '#/components/Messenger'
import { Props, State } from './types'

import AudioRecordingModal from '#/components/Modal/AudioRecordingModal'
import ChatDisconnectModal from '#/components/Modal/ChatDisconnectModal'
import Container from '#/components/Container'
import ExpandablePane from '#/components/ExpandablePane'
import { GroupConsentPolicyModal } from '#/components/Modal'
import Page from '#/components/Page'
import PatientWelcomeModal from '#/components/Modal/PatientWelcomeModal'
import { isMobileDevice } from '#/utils'
import { withRouter } from 'react-router-dom'

class Chat extends React.PureComponent<Props> {

  state: State = {
    welcomeModalIsOpen: false
  }

  static displayName = 'Chat'

  private refSider = React.createRef<ExpandablePane>()

  private closeWelcomeModal = () => {
    this.props.closeModal({ modal: 'patientWelcome' })
  }

  private handleConsentPolicyConsent = () => {
    this.props.acceptConsentPolicies()
  }

  componentWillUnmount () {
    this.props.clearSelectedChannel()
  }

  hideSider = () => {
    if (this.refSider.current) {
      this.refSider.current.toggle()
    }
  }

  render () {
    const { openWelcomeModal, selectedChannel, updatedConsentPolicies, loggedInUser } = this.props
    return (
      <Page title='Chat'>
        <AudioRecordingModal />
        <ChatDisconnectModal />
        <Container className='h100' flex grow fullWidth patientHeader={loggedInUser.is_patient} >
          <ExpandablePane
            forChat
            forPatient={loggedInUser.is_patient}
            isOpen={!isMobileDevice()}
            showPanelText={<span className='fa fa-angle-double-right' />}
            sidebar={<MessengerList type={this.props.type} hide={this.hideSider} />}
            main={<Messenger />}
            selectedChannel={selectedChannel}
            ref={this.refSider}
          />
        </Container>

        <PatientWelcomeModal
          isOpen={openWelcomeModal}
          close={this.closeWelcomeModal}
        />

        {
          updatedConsentPolicies &&
            <GroupConsentPolicyModal
              isOpen={!!updatedConsentPolicies}
              consentPolicies={updatedConsentPolicies}
              agree={this.handleConsentPolicyConsent}
            />
        }
      </Page>
    )
  }
}

export default withRouter(Chat)
