import * as React from 'react'

import { Action } from './Action.wrapper'
import { AddNewPatientModal } from '#/components/Modal/AddNewPatient'
import { AppState } from '#/redux'
import { CreatePatient } from '#/actions/patients'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { connect } from 'react-redux'
import { faUserFriends } from '@fortawesome/pro-light-svg-icons'

const styles = require('./styles.scss')

interface NewPatientProps {
  createPatient: typeof CreatePatient
}

class NewPatient extends React.Component<NewPatientProps> {
  state = {
    modalIsOpen: false
  }
  openModal = () => this.setState({ modalIsOpen: true })
  closeModal = () => this.setState({ modalIsOpen: false })

  handleSubmit = (values) => {
    this.props.createPatient({ data: values })
  }
  render () {
    return (
      <>
        <span className={styles.actionWrapper}>
          <Action
            icon={ <FontAwesomeIcon icon={faUserFriends}/> }
            label='Patient'
            onClick={this.openModal}
          />
        </span>
        <AddNewPatientModal
          isOpen={this.state.modalIsOpen}
          close={this.closeModal}
          onSubmit={this.handleSubmit}
        />
      </>
    )
  }
}

export const ConnectedNewPatient = connect<{}, NewPatientProps, {}, AppState>(
  (state: AppState) => (state),
  {
    createPatient: CreatePatient
  }
)(NewPatient)
