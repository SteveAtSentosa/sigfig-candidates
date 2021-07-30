import * as Modal from './Modal'
import * as React from 'react'

import { Column, Grid } from '#/components/BSGrid'
import { InjectedFormProps, reduxForm } from 'redux-form'
import { Option, SelectInput, TextInput } from '#/components/Form/Input'

import { AccountLookup } from '#/types'
import Button from '#/components/Button'
import { DateField } from '#/components/DatePicker'
import Field from '#/components/Form/Field'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { SearchFilters } from '#/reducers/appointments'
import { faRedo } from '@fortawesome/pro-regular-svg-icons'
import { omit } from 'lodash'

const styles = require('./styles.scss')

interface FormProps {
  providers: AccountLookup
  selectedProviderId: string
}

class Form extends React.Component<InjectedFormProps<{}, FormProps> & FormProps> {
  private get providerOptions (): Option[] {
    const { providers, selectedProviderId } = this.props
    return [{
      id: 'all',
      label: 'All',
      value: null
    }].concat(Array.from(providers).map(provider => ({
      id: provider.id,
      label: selectedProviderId === provider.id
        ? 'Myself'
        : `${provider.first_name} ${provider.last_name}`,
      value: provider.id
    })))
  }

  render () {
    const { initialize, handleSubmit } = this.props

    return (
      <>
        <Modal.Header>
          <div>Search Appointments</div>
          <Modal.HeaderButton onClick={() => initialize({})}>
            <div>Clear all</div>
            <div><FontAwesomeIcon icon={faRedo} /></div>
          </Modal.HeaderButton>
        </Modal.Header>
        <Modal.Body className={styles.searchAppointmentModalBody}>
          <form id='search_appointments' onSubmit={handleSubmit}>
            <div className={styles.modalContentContainer}>

              <Grid>
                <Column col={12} sm={6}>
                  <div className='left-col'>

                    <div className={styles.filterSection}>
                      <label>Patient First Name</label>
                      <Field
                        name='filter_first_name'
                        component={TextInput}
                      />
                    </div>

                    <div className={styles.filterSection}>
                      <label>Patient Last Name</label>
                      <Field
                        name='filter_last_name'
                        component={TextInput}
                      />
                    </div>

                    <div className={styles.filterSection}>
                      <label>Location Name</label>
                      <Field
                        name='filter_location'
                        component={TextInput}
                      />
                    </div>
                  </div>
                </Column>

                <Column col={12} sm={6}>
                  <div className='right-col'>
                    <div className={styles.filterSection}>
                      <label>Provider</label>
                      <Field
                        name='filter_provider'
                        component={SelectInput}
                        options={this.providerOptions}
                        defaultValue={null}
                        onBlur={() => true}
                      />
                    </div>

                    <div className={styles.filterSection}>
                      <label>Appointment Date</label>
                      <Field
                        component={DateField}
                        name='filter_start_date'
                        placeholderText='Start Date'
                        className={styles.date_field}
                        inputStyle
                        modifiers={{
                          dateFormat: 'MM/dd/yyyy'
                        }}
                      />
                      <Field
                        component={DateField}
                        name='filter_end_date'
                        placeholderText='End Date'
                        className={styles.date_field}
                        inputStyle
                        modifiers={{
                          dateFormat: 'MM/dd/yyyy'
                        }}
                      />
                    </div>
                  </div>
                </Column>
              </Grid>

            </div>
          </form>
        </Modal.Body>
      </>
    )
  }
}

const ReduxForm = reduxForm<{}, FormProps>({
  form: 'search_appointments'
})(Form)

interface Props {
  isOpen: boolean
  close: () => void
  handleSearch: (values: any) => void
  searchFilters: SearchFilters
  providers: AccountLookup
  selectedProviderId: string
}

const FilterModal = (props: Props) => {
  const { close, ...modalProps } = props
  return (
    <Modal.Wrapper
      size='md'
      onRequestClose={close}
      keyboard
      backdrop
      {...omit(modalProps, 'onRequestClose', 'handleSearch', 'searchFilters', 'selectedProviderId')}
    >
      <ReduxForm
        onSubmit={props.handleSearch}
        initialValues={props.searchFilters}
        providers={props.providers}
        selectedProviderId={props.selectedProviderId}
      />
      <Modal.Footer>
        <Button skinnyBtn onClick={close} secondary>Cancel</Button>
        <Button skinnyBtn submit form='search_appointments'>Filter</Button>
      </Modal.Footer>
    </Modal.Wrapper>
  )
}

export default FilterModal
