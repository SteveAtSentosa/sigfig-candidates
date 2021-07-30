import * as React from 'react'

import { endOfDay, startOfDay } from 'date-fns'

import DatePicker from 'react-datepicker'
import { validateDateFormat } from '#/utils'

require('react-datepicker/dist/react-datepicker-cssmodules.css')
const styles = require('./styles.scss')

interface Props {
  value?: Date | null
  onChange?: (e: any) => void
  modifiers?: object
  inputStyle?: boolean
  name: string
  placeholderText?: string
  dateFormat?: string
  strictParsing?: boolean
  className?: string
  disabled?: boolean
}

export class DateField extends React.PureComponent<Props> {
  state = {
    errored: false
  }
  handleOnChange = (date) => {
    this.setState({ errored: false })
    return this.props.onChange(date)
  }
  handleBlur = (e) => {
    if (!e.target.value.length) {
      return
    }
    const isValidDate = validateDateFormat(e.target.value)
    if (this.props.strictParsing && !isValidDate) {
      this.setState({ errored: true })
    }
  }
  get localTime () {
    const { value } = this.props
    return value ? new Date(value) : null
  }
  render () {
    const { modifiers, inputStyle, placeholderText, dateFormat = 'MM/dd/yyyy', strictParsing, disabled } = this.props
    const inputStyleClass = inputStyle ? styles.inputStyle : ''
    return (
      <>
        <DatePicker
          id='datePicker'
          selected={this.localTime}
          onChange={this.handleOnChange}
          dateFormat={dateFormat}
          placeholderText={placeholderText}
          className={inputStyleClass}
          strictParsing={strictParsing}
          onBlur={this.handleBlur}
          disabled={disabled}
          {...modifiers}
        />
        {this.state.errored && <span className={styles.error}>4 digit year is required&nbsp;</span>}
      </>
    )
  }
}

// export default DateField

export const DateFieldWithTime = (props: Props) => {

  return <DateField {...props} dateFormat={'MM/dd/yyyy h:mm aa'} />
}

export const StartDateField = (field) => {
  return (
    <DatePicker
      id='from'
      selectsStart
      selected={field.value ? field.value : startOfDay(new Date())}
      onChange={(date) => field.onChange(date)}
      dateFormat='MM/dd/yy'
      withPortal
    />
  )
}

export const EndDateField = (field) => {
  return (
    <DatePicker
       id='to'
       selectsEnd
       selected={field.value ? field.value : endOfDay(new Date())}
       onChange={(date) => field.onChange(date)}
       dateFormat='MM/dd/yy'
       withPortal
     />
  )
}
