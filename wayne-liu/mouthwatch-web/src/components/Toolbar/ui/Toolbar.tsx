import * as React from 'react'

import { ArchiveModal } from '#/components/Modal'
import BackButton from './ToolbarBackButton'
import { ConnectedUpgradeBadge } from '#/components/Badge'
import Menu from './ToolbarMenu'
import MessageButton from './ToolbarMessageButton'
import Title from './ToolbarTitle'
import { ToolbarUIProps } from '../types'

const styles = require('./styles.scss')

export default class Toolbar extends React.PureComponent<ToolbarUIProps> {

  private get isPatientArchived () {
    const { patient } = this.props
    return Boolean(patient && patient.status === 'Archived')
  }

  private renderBackButton = () => {
    const { backButton, backButtonLink, patientId } = this.props
    return (
      <BackButton
        backButton={backButton}
        backButtonLink={backButtonLink}
        patientId={patientId}
      />
    )
  }

  private renderToolbarChildren = () => {
    const {
      activatePatient, patient, checkThenSendMessage, closeArchiveModal,
      openArchiveModal, archiveModalIsOpen, title } = this.props

    return (
      <>
        <Title title={title}/>
        <MessageButton
          patient={patient}
          checkThenSendMessage={checkThenSendMessage}
          isPatientArchived={this.isPatientArchived}
        />
        <Menu
          patientSelected={!!patient}
          activatePatient={activatePatient}
          openArchiveModal={openArchiveModal}
          isPatientArchived={this.isPatientArchived}
        />
        <ArchiveModal
          close={closeArchiveModal}
          onHide={closeArchiveModal}
          isOpen={archiveModalIsOpen}
          user={patient}
          backdrop
          keyboard
        />
      </>
    )
  }

  render () {
    const { children, showUpgradeBadge } = this.props

    return (
        <div className={styles.toolbar}>
          {this.renderBackButton()}
          { showUpgradeBadge && <ConnectedUpgradeBadge badgeClassName={styles.upgradeBadge} /> }
          { children ? children : this.renderToolbarChildren() }
        </div>
    )
  }
}
