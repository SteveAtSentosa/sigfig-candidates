import * as React from 'react'

import { ActionProps, OwnProps, ReduxFormState, StateProps } from './types'
import { CleaveInput, CreatableInput, RadioInput, SelectInput } from '#/components/Form/Input'
import { Column, Grid } from '#/components/BSGrid'
import { FormatMoney, StripCommasFromFee, areaOptions } from '#/utils'
import { InjectedFormProps, reduxForm } from 'redux-form'
import { endOfDay, startOfDay } from 'date-fns'

import Button from '#/components/Button'
import { ConnectedProcedureCodeField } from '#/components/Form/ConnectedFields'
import { DateField } from '#/components/DatePicker'
import Field from '#/components/Form/Field'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Label from '#/components/Form/Label'
import Loader from '#/components/Loader'
import SurfaceModal from '#/components/Modal/SurfaceModal'
import ToothModal from '#/components/Modal/ToothModal'
import { faExternalLink } from '@fortawesome/pro-regular-svg-icons'

const styles = require('./add.scss')

const validate = (values) => {
  const errors: any = {}

  if (!values.procedure_code) {
    errors.procedure_code = 'Required'
  }
  if (!values.provider) {
    errors.provider = 'Required'
  }
  if (!values.status) {
    errors.status = 'Required'
  }
  if (values.status === 'Completed' && !values.start_date) {
    errors.start_date = 'Start date is required for this status'
  }
  if (values.status === 'Completed' && !values.end_date) {
    errors.end_date = 'End date is required for this status'
  }
  if (values.status === 'Started' && !values.start_date) {
    errors.start_date = 'Start date is required for this status'
  }

  return errors
}

type Props = StateProps & ActionProps & OwnProps & InjectedFormProps

class ReduxForm extends React.Component<Props, ReduxFormState> {
  state: ReduxFormState = {
    planStatus: 'proposed',
    isToothModalOpen: false,
    toothModalInputValue: '',
    toothModalValues: [],
    isSurfaceModalOpen: false,
    surfaceModalInputValue: '',
    surfaceModalValues: []
  }

  // update fee when procedure code changes
  private handleCodeChange = (e) => {
    const formatted = FormatMoney(e.fee)
    this.props.change('fee', formatted === '0.00' || formatted === '0' ? '' : formatted)
    return e
  }

  private handleStatusChange = (value, _, values) => {
    /*
      Autofill dates based on what status has been selected.
      Completed -> start & end date change.
      Started -> start change remove end.
      Proposed -> remove both.
    */
    const todayStartDate = startOfDay(new Date())
    const todayEndDate = endOfDay(new Date())
    switch (value) {
      case 'Completed':
        this.setState({ planStatus: 'Completed' })
        this.props.change('end_date', todayEndDate)
        values.start_date || this.props.change('start_date', todayStartDate)
        break
      case 'Started':
        this.setState({ planStatus: 'Started' }, () => {
          this.props.change('start_date', todayStartDate)
        })
        break
      case 'Proposed':
        this.setState({ planStatus: 'Proposed' }, () => {
          this.props.change('start_date', null)
          this.props.change('end_date', null)
        })
        break
    }
    return value
  }

  private reduxFormChange = (fieldName: string, value: any) => {
    this.props.change(fieldName, value)
  }

  private createOption = (label: string) => ({
    label,
    value: label
  })
  private closeToothModal = () => this.setState({ isToothModalOpen: false })
  private handleToothSubmit = (values: string[]) => {
    const formattedValues = values.map(value => ({ label: value, value }))
    this.reduxFormChange('tooth', formattedValues)
    this.setState({ toothModalValues: formattedValues })
    this.closeToothModal()
  }
  private handleToothChange = (value: any) => {
    this.setState({ toothModalValues: value }, () => {
      this.reduxFormChange('tooth', this.state.toothModalValues)
    })
  }
  private handleToothInputChange = (inputValue: string) => {
    this.setState({ toothModalInputValue: inputValue })
  }
  private handleToothKeyDown = (event: any): void => {
    const { toothModalInputValue, toothModalValues } = this.state
    if (!toothModalInputValue) return
    switch (event.key) {
      case 'Tab':
      case 'Enter':
      case ',':
      // validate input
        if ((parseInt(toothModalInputValue, 10) > 0 && parseInt(toothModalInputValue, 10) < 33) || /^[A-Z]{1}$/.test(toothModalInputValue)) {
          this.setState({
            toothModalInputValue: '',
            toothModalValues: [...toothModalValues, this.createOption(toothModalInputValue)]
          }, () => {
            this.reduxFormChange('tooth', this.state.toothModalValues)
          })
        } else {
          this.setState({
            toothModalInputValue: ''
          })
        }

        event.preventDefault()
    }
  }
  private closeSurfaceModal = () => this.setState({ isSurfaceModalOpen: false })
  private handleSurfaceSubmit = (values: string[]) => {
    const formattedValues = values.reduce((arr, value) => {
      arr.push({ label: value, value: value })
      return arr
    }, [])
    this.reduxFormChange('surface', formattedValues)
    this.setState({ surfaceModalValues: formattedValues })
    this.closeSurfaceModal()
  }
  private handleSurfaceChange = (value: any) => {
    this.setState({ surfaceModalValues: value }, () => {
      this.reduxFormChange('surface', this.state.surfaceModalValues)
    })
  }
  private handleSurfaceInputChange = (inputValue: string) => {
    this.setState({ surfaceModalInputValue: inputValue })
  }
  private handleSurfaceKeyDown = (event: any): void => {
    const { surfaceModalInputValue, surfaceModalValues } = this.state
    if (!surfaceModalInputValue) return
    switch (event.key) {
      case 'Tab':
      case 'Enter':
      case ',':
      // validate input
        if (/[A-Z]/.test(surfaceModalInputValue)) {
          this.setState({
            surfaceModalInputValue: '',
            surfaceModalValues: [...surfaceModalValues, this.createOption(surfaceModalInputValue)]
          }, () => {
            this.reduxFormChange('surface', this.state.surfaceModalValues)
          })
        } else if (/[a-z]/.test(surfaceModalInputValue)) {
          this.setState({
            surfaceModalInputValue: '',
            surfaceModalValues: [...surfaceModalValues, this.createOption(surfaceModalInputValue.toUpperCase())]
          }, () => {
            this.reduxFormChange('surface', this.state.surfaceModalValues)
          })
        } else {
          this.setState({
            surfaceModalInputValue: ''
          })
        }

        event.preventDefault()
    }
  }

  private submit = (values) => {
    const { patientId, appointmentId } = this.props
    // account for undefined fee, remove commas, and set to two decimal places
    values.fee = StripCommasFromFee(values.fee)
    // procedures must be associated either to a patient or an appointment
    if (this.props.appointmentId) {
      // From Appointment > Add Codes
      this.props.createProcedure({ data: Object.assign(values, { appointment_id: appointmentId }), patientId, fetchPatientData: this.props.fetchPatientData })
    } else if (this.props.patientId) {
      // From Patient > Posting || Treatment Plan Builder > Create New Procedure
      this.props.createProcedure({ data: Object.assign(values, { patient_id: patientId }), patientId, fetchPatientData: this.props.fetchPatientData })
    }

    this.setState({ toothModalInputValue: '', toothModalValues: [], surfaceModalInputValue: '', surfaceModalValues: [] })

    if (this.props.afterSubmit) {
      this.props.afterSubmit()
    }
  }

  private loadProviders = () => {
    const { patientId, appointment } = this.props
    const associations = [{ model: 'group', associations: [{ model: 'group', as: 'parentGroup' }] }]
    if (patientId) {
      this.props.getProvidersForSelectedPatient({ id: patientId, associations })
    } else if (appointment) {
      this.props.getProvidersForSelectedPatient({ id: appointment.patient_id, associations })
    }
  }

  private loadProcedureCodes = () => {
    const year = new Date().getFullYear().toString()
    this.props.getProcedureCodes({ where: [{ and : [{ prop: 'year', comp: '=', param: year }] }] })
  }

  componentDidUpdate (prevProps) {
    if (prevProps.creating && !this.props.creating) {
      if (!this.props.error) {
        this.props.reset()
        this.setState({ planStatus: 'Proposed' })
      }
    }
  }

  componentDidMount () {
    this.loadProviders()
    this.loadProcedureCodes()
    this.setState({ planStatus: 'Proposed' })
  }

  componentWillUnmount () {
    this.props.clearProviders()
  }

  private get providers () {
    return this.props.providers.map(provider => ({ label: `${provider.first_name} ${provider.last_name}`, value: provider.id }))
  }

  render () {
    const { planStatus } = this.state
    const { creating, providers, procedureCodes } = this.props

    return (
      <section className={styles.add}>
        {
          creating || !providers || !procedureCodes
          ?
          <Loader />
          :
          <form onSubmit={this.props.handleSubmit(this.submit)} id='add_procedure'>
            <Grid>
              <Column col={12} sm={5}>
                <Label htmlFor='code'>Procedure Code</Label>
                <Field
                  component={ConnectedProcedureCodeField}
                  name='procedure_code'
                  placeholder='Select or begin typing procedure code'
                  normalize={this.handleCodeChange}
                  codes={procedureCodes}
                  // hotfix to stop component from re-rendering(?) and resetting field value in redux store
                  onBlur={() => true}
                />
                <Label htmlFor='provider'>Provider</Label>
                <Field
                  component={SelectInput}
                  options={this.providers}
                  name='provider'
                  placeholder='Select provider'
                  onBlur={() => true}
                />
                <Grid>
                  <Column col={12}>
                    <Label htmlFor='tooth'>Tooth Number</Label>
                    <Field
                      component={CreatableInput}
                      isMulti
                      name='tooth'
                      components={{
                        DropdownIndicator: (a) => {
                          return (
                            <button
                              className={styles.launchModal}
                              onClick={() => this.setState({ isToothModalOpen: true, toothModalValues: a.getValue() })}
                            >
                              <FontAwesomeIcon icon={faExternalLink} />
                            </button>
                          )
                        },
                        Menu: () => null
                      }}
                      onBlur={() => true}
                      value={this.state.toothModalValues}
                      inputValue={this.state.toothModalInputValue}
                      onChange={this.handleToothChange}
                      onInputChange={this.handleToothInputChange}
                      onKeyDown={this.handleToothKeyDown}
                    />
                  </Column>
                  <Column col={12}>
                    <Label htmlFor='surface'>Surface</Label>
                    <Field
                      component={CreatableInput}
                      name='surface'
                      components={{
                        DropdownIndicator: (a) => (
                          <button
                            className={styles.launchModal}
                            onClick={() => this.setState({ isSurfaceModalOpen: true, surfaceModalValues: a.getValue() })}
                          >
                            <FontAwesomeIcon icon={faExternalLink} />
                          </button>
                        ),
                        Menu: () => null
                      }}
                      onBlur={() => true}
                      value={this.state.surfaceModalValues}
                      inputValue={this.state.surfaceModalInputValue}
                      onChange={this.handleSurfaceChange}
                      onInputChange={this.handleSurfaceInputChange}
                      onKeyDown={this.handleSurfaceKeyDown}
                    />
                  </Column>
                  <Column col={12}>
                    <Label htmlFor='area'>Area</Label>
                    <Field
                      component={SelectInput}
                      options={areaOptions}
                      name='area'
                      placeholder='Select area'
                      onBlur={() => true}
                    />
                  </Column>
                </Grid>
              </Column>
              <Column col={12} sm={4}>
                <Grid>
                  <Column col={6}>
                    <Label htmlFor='start_date'>Start Date</Label>
                      <Field
                        component={DateField}
                        name='start_date'
                        modifiers={{
                          id: 'from',
                          selectsStart: true,
                          disabled: planStatus === 'Proposed' || planStatus === ''
                        }}
                        inputStyle
                        dateFormat='MM/dd/yyyy'
                        strictParsing
                      />
                  </Column>
                  <Column col={6}>
                    <Label htmlFor='end_date'>End Date</Label>
                    <Field
                      component={DateField}
                      name='end_date'
                      modifiers={{
                        id: 'to',
                        selectsEnd: true,
                        disabled: planStatus === 'Started' || planStatus === '' || planStatus === 'Proposed'
                      }}
                      inputStyle
                      dateFormat='MM/dd/yyyy'
                      strictParsing
                    />
                  </Column>
                </Grid>
                <Grid>
                  <Column col={6}>
                    <Label htmlFor='fee'>Fee</Label>
                    <Field
                      component={CleaveInput}
                      name='fee'
                      options={{
                        numeral: true,
                        numeralThousandsGroupStyle: 'thousand'
                      }}
                      currency
                    />
                  </Column>
                </Grid>
              </Column>
              <Column col={12} sm={3} className={styles.row3}>
                <Label htmlFor='status'>Procedure Status</Label>
                <div className={styles.radioContainer}>
                  <Field
                    component={RadioInput}
                    type='radio'
                    name='status'
                    text='Completed'
                    value='Completed'
                    normalize={this.handleStatusChange}
                  />
                  <Field
                    component={RadioInput}
                    type='radio'
                    name='status'
                    text='Started'
                    value='Started'
                    normalize={this.handleStatusChange}
                  />
                  <Field
                    component={RadioInput}
                    type='radio'
                    name='status'
                    text='Proposed'
                    value='Proposed'
                    normalize={this.handleStatusChange}
                  />
                </div>
                <div>
                  <Button skinnyBtn submit form='add_procedure'>Add Procedure</Button>
                </div>
              </Column>
            </Grid>
          </form>
        }
        <ToothModal
          isOpen={this.state.isToothModalOpen}
          close={this.closeToothModal}
          initialValues={this.state.toothModalValues}
          handleSubmit={this.handleToothSubmit}
        />
        <SurfaceModal
          isOpen={this.state.isSurfaceModalOpen}
          close={this.closeSurfaceModal}
          initialValues={this.state.surfaceModalValues}
          handleSubmit={this.handleSurfaceSubmit}
        />
      </section>
    )

  }
}

const Form = reduxForm({
  form: 'add_procedure',
  validate
})(ReduxForm)

export default Form
