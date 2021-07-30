import * as Modal from '#/components/Modal'
import * as React from 'react'

import { FormValues, Props } from './types'

import Button from '#/components/Button'
import Form from './Form'
import { omit } from 'lodash'

export default class AddNewPatientModal extends React.PureComponent<Props> {

  private addNewPatient = (values: FormValues) => {
    if (values.groups.length && values.practices.length) {
      values.groups = values.practices
    } else {
      const groups = values.groups.concat(values.practices)
      values.groups = groups
    }
    this.props.onSubmit(omit(values, 'practices') as FormValues)
  }

  componentDidUpdate (prevProps: Props) {
    if (prevProps.posting && !this.props.posting) {
      if (!this.props.error) {
        this.props.close()
      }
    }
  }

  render () {
    const {
      close, hasValidEmail, isUnderage, isOpen, defaultGroupOptions,
      defaultPracticeOptions, changeSelectedGroupId, selectedGroupId,
      defaultPracticeValue
    } = this.props

    return (
      <Modal.Wrapper
        backdrop
        keyboard
        size='md'
        onHide={close}
        isOpen={isOpen}
        close={close}
      >
        <Modal.Header>Add New Patient</Modal.Header>
        <Modal.Body>
          <Form
            isUnderage={isUnderage}
            hasValidEmail={hasValidEmail}
            onSubmit={this.addNewPatient}
            selectedGroupId={selectedGroupId}
            changeSelectedGroupId={changeSelectedGroupId}
            groupOptions={defaultGroupOptions}
            practiceOptions={defaultPracticeOptions}
            initialValues={{
              groups: defaultGroupOptions,
              practices: defaultPracticeValue
            }}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button skinnyBtn secondary onClick={close}>Close</Button>
          <Button skinnyBtn submit form='addNewPatient'>Add</Button>
        </Modal.Footer>
      </Modal.Wrapper>
    )
  }
}
