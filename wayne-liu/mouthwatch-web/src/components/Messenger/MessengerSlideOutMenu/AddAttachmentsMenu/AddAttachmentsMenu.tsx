import * as React from 'react'

import { Props, State } from './types'

import CollectedData from '#/pages/Patients/CollectedData'
import { ConnectedPatientField } from '#/components/Form/ConnectedFields'
import { Option } from '#/types'

const styles = require('./styles.scss')

export default class AddAttachmentsMenu extends React.PureComponent<Props, State> {

  state: State = {
    selectedPatientId: null
  }

  handlePatientChange = (patient: Option) => {
    const { clearSelectedMedia, clearAllAttachments } = this.props
    // Can only attach media for one patient at a time
    clearAllAttachments()
    clearSelectedMedia()
    this.setState({ selectedPatientId: patient.value })
  }

  get renderDropdown () {
    const { patientId } = this.props
    return (
      !patientId &&
      <div className={styles.select_patient}>
        <label>Patient</label>
        <ConnectedPatientField
          name='patient'
          onChange={this.handlePatientChange}
          placeholder='Start typing to find a patient...'
        />
      </div>
    )
  }

  get renderCollectedData () {
    const { patientId, thumbnailOptions } = this.props
    const { selectedPatientId } = this.state
    return (
      <CollectedData
        hideFilterBar
        hideUpload
        patientId={patientId || selectedPatientId}
        includedFilters={['image', 'doc', 'audio', 'plan', 'video']}
        thumbnailOptions={thumbnailOptions}
      />
    )
  }

  render () {
    return (
      <>
        {this.renderDropdown}
        {this.renderCollectedData}
      </>
    )
  }
}
