import * as Modal from '#/components/Modal'
import * as React from 'react'

import { Column, Grid } from '#/components/BSGrid'
import { DefaultProps, FieldProps, FormData, FormProps, ModifiedOption, Props } from './types'
import { isEqual, pick, sortBy } from 'lodash'

import AccountAvatar from '#/components/AccountAvatar'
import Button from '#/components/Button'
import Field from '#/components/Form/Field'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { MultiValueProps } from 'react-select/lib/components/MultiValue'
import { OptionProps } from 'react-select/lib/components/Option'
import { SelectInput } from '#/components/Form/Input'
import { User } from '#/microservice-middleware'
import { components } from 'react-select'
import { faTimes } from '@fortawesome/pro-light-svg-icons'
import { reduxForm } from 'redux-form'

const styles = require('./styles.scss')

const Form: React.FunctionComponent<FormProps> = ({ disableAdding, ...props }) => {

  const MultiValueContainer = (props: MultiValueProps<ModifiedOption>) => {
    return (
      <components.MultiValueContainer {...props}>
        <AccountAvatar
          height={30}
          width={30}
          className={styles.modalAvatar}
          entityId={props.data.data.is_patient ? props.data.data.patient_id : props.data.value}
          type={ props.data.data.is_patient ? 'patient' : 'provider'}
          showStatusIndicator />
        {props.children}
      </components.MultiValueContainer>
    )
  }

  const Option = (props: OptionProps<ModifiedOption>) => {
    return (
      <components.Option {...props}>
        <AccountAvatar
          height={30}
          width={30}
          className={styles.modalAvatar}
          entityId={props.data.data.is_patient ? props.data.data.patient_id : props.data.value}
          type={ props.data.data.is_patient ? 'patient' : 'provider'}
          showStatusIndicator />
        <div className={styles.label}>
          {props.data.label}{props.data.data.status === 'inactive' && ' (Deactivated)'}
        </div>
      </components.Option>
    )
  }

  return (
    <form id={props.form} onSubmit={props.handleSubmit}>
      <Grid>
        <Column col={12} sm={7} lg={9}>
          <Field
            className={styles.options}
            component={SelectInput}
            options={props.options}
            isMulti
            isSearchable={!disableAdding}
            menuIsOpen={disableAdding ? false : undefined}
            name='users'
            onBlur={null}
            components={{
              MultiValueContainer,
              Option,
              DropdownIndicator: !disableAdding && components.DropdownIndicator
            }} />
        </Column>
        <Column col={12} sm={5} lg={3}>
          <Button submit skinnyBtn form={props.form}>
            Start
          </Button>
        </Column>
      </Grid>
    </form>
  )
}

const SelectMessageRecipients = reduxForm<FormData, FieldProps>({})(Form)

class AddNewMessageModal extends React.PureComponent<Props> {

  static defaultProps: DefaultProps = {
    formValues: []
  }

  private startNewMessage = (values: FormData) => {
    const userIds = values.users.map(option => option.value)
    this.props.createChannelAndAutoSelect({ userIds })
    this.props.close()
  }

  private onMessageCreate = (values: FormData): void => {
    const { channels, selectChannel, archiveChannel, loggedInUserId } = this.props
    const userIds = [loggedInUserId, ...values.users.map(option => option.value)].sort()
    const userIdChannels = channels.map(c => ({ channelId: c.id, usersToChannel: c.userToChannels.map(uC => uC.userId).sort() }))
    const archivedChannelExists = userIdChannels.find(uiC => isEqual(uiC.usersToChannel, userIds))
    // Reopen a previously archived channel
    if (archivedChannelExists) {
      selectChannel({ channelId: archivedChannelExists.channelId })
      archiveChannel({ channelId: archivedChannelExists.channelId, archived: false })
      this.props.close()
    } else {
      // Create a new channel
      this.startNewMessage(values)
    }
  }

  private get options () {
    const { chatUsers, loggedInUserId, channels, formValues } = this.props
    const filteredChatUsers = chatUsers
      .filter(user => {
        // do not show logged in user
        return user.accountData.id !== loggedInUserId
      })
      .filter(user => {
        // only show inactive accounts if a channel already exists for them
        const existingChannel = channels.find(channel => channel.userToChannels.map(c => c.userId).includes(user.id))
        return user.accountData.status !== 'inactive' || existingChannel
      })
      .filter(user => {
        // filter out patients if a patient is already selected
        return formValues.some(fV => fV.data.is_patient) ? !user.accountData.is_patient : user
      })

    const sortedChatUsers: User[] = sortBy(filteredChatUsers, ['accountData.first_name'])
    return sortedChatUsers.map(({ accountData: { first_name, last_name, id, is_patient, patient_id, status } }) => ({ label: `${first_name} ${last_name}`, value: id, data: { is_patient, patient_id, status } }))
  }

  render () {
    const { close, groupMessagingEnabled, formValues, ...modalProps } = this.props
    return (
      <Modal.Wrapper
        size='md'
        {...pick(modalProps, Modal.keysOfBaseModalProps)}
        className={styles.addNewMessageModal}
      >
        <Modal.Header>
          <h5 className={styles.heading}>New Message</h5>
          <span className={styles.closeModal} onClick={close}>
            <FontAwesomeIcon icon={faTimes} />
          </span>
        </Modal.Header>
        <Modal.Body className={styles.body}>
          {groupMessagingEnabled
            ? <h6>Start a new message or find an old one.</h6>
            : <h6>Start a new message or find an old one.<br/>Your Essential plan restricts message channels to two total participants.</h6>}
          <SelectMessageRecipients disableAdding={!groupMessagingEnabled && !!formValues.length} options={this.options} onSubmit={this.onMessageCreate} form='selectMessageRecipients' />
        </Modal.Body>
      </Modal.Wrapper>
    )
  }
}

export default AddNewMessageModal
