import * as React from 'react'
const styles = require('./styles.scss')

interface Props {
  children: Array<Option>
  handleChange?: ((e: object) => any)
  style?: React.CSSProperties
  value?: string | number
  selected?: string | number

}
interface Option {
  value?: string | number
  text?: string | number
  label?: string | number
}

export const Dropdown = (props: Props) => {
  const options = props.children.map((option, i) => <option value={option.value} key={i}>{option.text || option.label}</option>)
  return (
    <div style={props.style} className={styles.filterContainer}>
      <select
        onChange={props.handleChange}
        value={props.value}
      >
        {options}
      </select>
    </div>
  )
}

export default Dropdown
