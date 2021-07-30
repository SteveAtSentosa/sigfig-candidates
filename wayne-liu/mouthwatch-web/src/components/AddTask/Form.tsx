import * as React from 'react'

import { Column, Grid } from '#/components/BSGrid'
import { InjectedFormProps, Fields as ReduxFormFields, reduxForm } from 'redux-form'
import { SelectInput, TextAreaInput } from '#/components/Form/Input'

import Button from '#/components/Button'
import { ConnectedPropertyField } from '#/components/Form/ConnectedFields'
import { DateField } from '#/components/DatePicker'
import Field from '#/components/Form/Field'
import Label from '../Form/Label'
import { Option } from '#/types'
import { RequiredIndicator } from '#/components/Form/RequiredIndicator'
import { TaskPriorityField } from '../Form/Task/AddNewTaskForm'
import { components } from 'react-select'

const styles = require('./styles.scss')

interface FormValues {
  type: string
  assignee: Option
  due_date: number
  priority: string
  details: string
  patient: Option
  providerOptions: Option[]
}

const validate = (values: FormValues) => {
  const errors: any = {}

  if (!values.type) {
    errors.type = 'Please select a task'
  }
  if (!values.assignee) {
    errors.assignee = 'Please select an assignee'
  }
  if (!values.due_date) {
    errors.due_date = 'Please set a due date'
  }

  return errors
}

const TaskPatientField = (field) => (
  <SelectInput
    name='patient'
    value={field.value}
    options={[]}
    disabled
    components={{
      ...components,
      IndicatorSeparator: null,
      DropdownIndicator: null
    }}
  />
)

const AddTaskForm: React.FC<InjectedFormProps<FormValues>> = ({ handleSubmit, form, initialValues }) => {
  return (
    <form id={form} onSubmit={handleSubmit}>
      <Grid>
        <Column col={12} sm={6}>
          <div className={styles.contentContainer}>
            <div className={styles.type}>
              <div className={styles.newTaskSection}>
                <Label>Type<RequiredIndicator /></Label>
                <Field
                  name='type'
                  component={ConnectedPropertyField}
                  model='task'
                  property='type'
                  onBlur={() => true}
                />
              </div>
            </div>
          </div>
          <div className={styles.contentContainer}>
            <div className={styles.row}>
              <div className={styles.priority}>
                <div className={styles.newTaskSection}>
                  <Label>Priority<RequiredIndicator /></Label>
                  <ReduxFormFields
                    names={['priority']}
                    component={TaskPriorityField}
                  />
                </div>
              </div>
              <div className={styles.advanced}>
                <Label>Details</Label>
                <Field
                  name='details'
                  component={TextAreaInput}
                  maxLength={255}
                />
              </div>
            </div>
          </div>
        </Column>
        <Column col={12} sm={6}>
          <Grid>
            <Column col={12}>
              <Label>Provider<RequiredIndicator /></Label>
              <Field
                name='assignee'
                component={SelectInput}
                options={(initialValues as any).providerOptions}
                onBlur={() => true}
              />
            </Column>
            <Column col={6} md={12} lg={6}>
              <Label>Due Date<RequiredIndicator /></Label>
              <Field
                name='due_date'
                component={DateField}
                modifiers={{ id: 'due_date' }}
                dateFormat='MM/dd/yyyy'
              />
            </Column>
            <Column col={6} md={12} lg={6}>
              <Label>Time</Label>
              <Field
                name='time'
                component={DateField}
                modifiers={{
                  id: 'time',
                  showTimeSelect: true,
                  showTimeSelectOnly: true,
                  timeIntervals: 15,
                  timeCaption: 'Time',
                  dateFormat: 'h:mm aa'
                }}
              />
            </Column>
            <Column col={12}>
              <Label>Patient</Label>
              <Field
                name='patient'
                component={TaskPatientField}
              />
            </Column>
            <Column col={12}>
              <Button skinnyBtn submit form='add_new_task_appt'>Create Task</Button>
            </Column>
          </Grid>
        </Column>
      </Grid>
    </form>
  )
}

export default reduxForm<FormValues, {}>({
  validate,
  form: 'add_new_task_appt',
  enableReinitialize: true
})(AddTaskForm)
