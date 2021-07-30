import * as Modal from '#/components/Modal'
import * as React from 'react'

import { Account, Patient } from '#/types'

import Button from '#/components/Button'
import Loader from '#/components/Loader'
import { Props } from './types'
import { pick } from 'lodash'

const styles = require('./styles.scss')

class ArchiveModal extends React.PureComponent<Props> {
  private successAPIResult = () => {
    return this.props.showNotificationPopUp({ type: 'success', content: (<div>Patient archived</div>) })
  }

  private get patient (): Patient {
    const { user } = this.props
    if ('patient' in user) {
      // This is a ChatUser
      return user.patient
    }
    if ('account_id' in user) {
      // This is a Patient
      return user
    }
    // This is an Account
    return null
  }

  get chatUser (): Account {
    const { user, chatUsers } = this.props
    if ('patient' in user) {
      return user
    }
    if ('account_id' in user) {
      return chatUsers[user.account_id]
    }
    if ('username' in user) {
      return chatUsers[user.id]
    }

    return null
  }

  private archive = () => {
    const { archivePatient } = this.props
    if (this.patient) {
      return archivePatient({ id: this.patient.id, patient: this.patient })
    }
  }

  private close = () => {
    this.props.clearArchiveError()
    this.props.close()
  }

  componentDidUpdate (prevProps: Props) {
    if (prevProps.saving && !this.props.saving) {
      if (!this.props.error) {
        this.close()
        this.successAPIResult()
        this.props.history.replace('/patients')
      }
    }
  }

  render () {
    const { close, saving, error, ...modalProps } = this.props

    return (
      <Modal.Wrapper
        size='sm'
        {...pick(modalProps, Modal.keysOfBaseModalProps)}
      >
        <Modal.Header>{error ? 'Unable to Archive Patient' : 'Confirmation'}</Modal.Header>
        <Modal.Body className={styles.archiveModalBody} >
          {
            saving
            ?
            <Loader />
            :
            <>
              {
                error
                ?
                <p>{error.message}</p>
                :
                <>
                  <p>
                    Archived patients are not shown in the patient list or chat list by default. You can see archived patients by going to Advanced Search Options
                    and selected Include Archived Patients.
                  </p>
                  <p>Are you sure you would like to archive this patient?</p>
                </>
              }
            </>
          }

        </Modal.Body>
        <Modal.Footer>
          {
            !saving &&
            <Button skinnyBtn secondary onClick={this.close}>{error ? 'Close' : 'Cancel'}</Button>
          }
          {
            !saving && !error &&
            <Button skinnyBtn onClick={this.archive}>Confirm</Button>
          }
        </Modal.Footer>
      </Modal.Wrapper>
    )
  }
}

export default ArchiveModal
