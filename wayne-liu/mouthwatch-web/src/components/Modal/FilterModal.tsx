import * as Modal from './Modal'
import * as React from 'react'

import { CheckboxInput, SelectInput, TextInput } from '#/components/Form/Input'
import { Column, Grid } from '#/components/BSGrid'
import { ConnectedAssigneeField, ConnectedPropertyField } from '#/components/Form/ConnectedFields'
import { EndDateField, StartDateField } from '#/components/DatePicker'
import {
  InjectedFormProps,
  Field as ReduxFormField,
  Fields as ReduxFormFields,
  reduxForm
} from 'redux-form'

import { AppState } from '#/redux'
import Button from '#/components/Button'
import Field from '#/components/Form/Field'
import { FilterObject } from '#/actions/types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { components } from 'react-select'
import { connect } from 'react-redux'
import { faRedo } from '@fortawesome/pro-regular-svg-icons'
import { keysOfBaseModalProps } from '#/components/Modal'
import { pick } from 'lodash'

const styles = require('./styles.scss')

const Option = (props) => {
  return (
    <components.Option {...props}>
      <CheckboxInput text={props.data.label} name={props.data.label} checked={props.isSelected} onChange={() => false} />
    </components.Option>
  )
}
const Menu = (props) => {
  const { selectProps } = props
  return (
    <components.Menu {...props}>
      {
        !props.selectProps.inputValue && (
          <div style={{ padding: '12px' }}>
            <CheckboxInput
              text='Select all'
              name='all'
              checked={selectProps.value.length === props.options.length}
              onChange={(e) => e.target.checked ? selectProps.onChange(selectProps.options) : selectProps.onChange([])}
            />
          </div>
        )
      }
      {props.children}
    </components.Menu>
  )
}

const AssigneeField = (field) => (
  <ConnectedAssigneeField
    name='assignee'
    value={field.value}
    onChange={value => field.onChange(value)}
    modifiers={{
      components: {
        Option,
        Menu
      },
      isMulti: true,
      closeMenuOnSelect: false,
      hideSelectedOptions: false,
      placeholder: 'Search providers'
    }}
  />
)

const dueDateOptions = [
  { label: 'All', value: 'all' },
  { label: 'Currently Overdue', value: 'currently_overdue' },
  { label: 'Due Today', value: 'due_today' },
  { label: 'Due Within 5 Days', value: 'due_5_days' },
  { label: 'Between Dates', value: 'between_dates' }
]

const OptionForDueDate = (props) => {
  if (props.data.value === 'between_dates') {
    return (
      <components.Option {...props}>
        <ReduxFormFields
          names={[
            'filter_by_due_date.start_date',
            'filter_by_due_date.end_date'
          ]}

          component={BetweenDatesField}
        />
      </components.Option>
    )
  }
  return <components.Option {...props}>{props.data.label}</components.Option>
}

const DueDateField = (field) => {
  return (
    <SelectInput
      name='due_date'
      onChange={value => field.onChange(value)}
      value={field.value}
      closeMenuOnSelect={false}
      hideSelectedOptions={false}
      options={dueDateOptions}
      components={{
        ...components,
        Option: OptionForDueDate
      }}
    />
  )
}

const BetweenDatesField = () => (
  <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
    <span>Between </span>
    <Field name='start_date' component={StartDateField} />
    <span>and</span>
    <Field name='end_date' component={EndDateField} />
  </div>
)

const statusOptions = [
  { label: 'All', value: 'all' },
  { label: 'Open', value: 'Open' },
  { label: 'Complete', value: 'Complete' }
]

const priorityOptions = [
  { label: 'Low', value: 'Low' },
  { label: 'Medium', value: 'Medium' },
  { label: 'High', value: 'High' }
]

const StatusField = (field) => {
  return (
    <SelectInput
      name='task_status'
      onChange={value => field.onChange(value)}
      value={field.value}
      options={statusOptions}
    />
  )
}

const PriorityField = (field) => {
  return (
    <SelectInput
      name='priority'
      onChange={value => field.onChange(value)}
      value={field.value}
      options={priorityOptions}
    />
  )
}

const filterSearchField = (field) => (
  <TextInput
    name='filterSearch'
    placeholder='Search task details'
    onChange={(value) => field.input.onChange(value)}
    value={field.input.value}
    maxLength={255}
  />
)

const Form = reduxForm({
  form: 'filter_tasks'
})((props: InjectedFormProps) => (
  <>
    <Modal.Header>
      <div>Task Filters</div>
      <Modal.HeaderButton onClick={() => props.initialize({})}>
        <div>Clear all</div>
        <div><FontAwesomeIcon icon={faRedo} /></div>
      </Modal.HeaderButton>
    </Modal.Header>
    <Modal.Body>
      <form id='filter_tasks' onSubmit={props.handleSubmit}>
        <div className={styles.filterSearch}>
          <label>Search keyword</label>
          <div>
            <ReduxFormField
              name='filter_search'
              component={filterSearchField}
            />
          </div>
          <Grid>
            <Column col={12} sm={6}>
              <div className='left-col'>

                <div className={styles.filterSection}>
                  <label>Provider: </label>
                  <Field
                    name='filter_by_assignee.assignees'
                    component={AssigneeField}
                  />

                </div>

                <div className={styles.filterSection}>
                  <label>Type: </label>
                  <Field
                    name='filter_by_type'
                    component={ConnectedPropertyField}
                    model='task'
                    property='type'
                    onBlur={() => true}
                    isMulti={true}
                  />
                </div>
              </div>
            </Column>

            <Column col={12} sm={6}>
              <div className='right-col'>

                <div className={styles.filterSection}>
                  <label>Due Date: </label>
                  <Field
                    name='filter_by_due_date'
                    component={DueDateField}
                  />
                </div>

                <div className={styles.filterSection}>
                  <label>Status: </label>
                  <Field
                    name='filter_by_status'
                    component={StatusField}
                  />
                </div>

                <div className={styles.filterSection}>
                  <label>Priority: </label>
                  <Field
                    name='filter_by_priority'
                    component={PriorityField}
                  />
                </div>
              </div>
            </Column>
          </Grid>

        </div>
      </form>
    </Modal.Body>
  </>
))

interface Props {
  isOpen: boolean
  close: () => void
  handleSubmitFilters: (values: any) => any
}
interface StateProps {
  filters: FilterObject
}

const FilterModal = (props: Props & StateProps) => {
  const { handleSubmitFilters, filters, ...modalProps } = props
  return (
    <Modal.Wrapper
      keyboard
      backdrop
      {...pick(modalProps, keysOfBaseModalProps)}
    >
      <Form onSubmit={handleSubmitFilters} initialValues={filters} />
      <Modal.Footer>
        <Button skinnyBtn onClick={props.close} secondary>Cancel</Button>
        <Button skinnyBtn submit form='filter_tasks'>Filter</Button>
      </Modal.Footer>
    </Modal.Wrapper>
  )
}

export default connect<StateProps, {}, Props, AppState>(
  (state: AppState) => ({
    filters: state.tasks.list.filters
  })
)(FilterModal)
