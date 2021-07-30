import * as React from 'react'
import { DateField } from '#/components/DatePicker'
import { connect } from 'react-redux'
import { AppState } from '#/redux'
import { SetCurrentDate } from '#/actions/appointments'

interface OwnProps {
  icon?: React.ReactNode
}

interface StateProps {
  current_date: Date
}
interface ActionProps {
  setCurrentDate: typeof SetCurrentDate
}

const ApptDatePicker = (props: OwnProps & StateProps & ActionProps) => {
  return (
    <DateField
      name='dashboard_datepicker'
      modifiers={{
        id: 'appointments',
        selected: props.current_date,
        onChangeRaw: (e) => e.preventDefault(),
        onChange: (date) => props.setCurrentDate({ date: date }),
        dateFormat: 'EEEE, MMMM d, yyyy',
        customInput: props.icon && props.icon
      }}

    />
  )

}

export default connect<StateProps, ActionProps, OwnProps, AppState>(
  (state) => ({
    current_date: state.appointments.current_date
  }),
  {
    setCurrentDate: SetCurrentDate
  }
)(ApptDatePicker)
