import * as React from 'react'
const styles = require('./styles.scss')

type DefaultProps = {
  firstName: string
  lastName: string
  additionalClassName?: string
}

export default class Default extends React.Component<DefaultProps> {
  firstLetterFormatter = (value) => {
    const trimmed = value.trim()
    return trimmed.length === 0 ? '' : trimmed[0].toUpperCase()
  }
  render () {
    const firstInitial = this.firstLetterFormatter(this.props.firstName)
    const secondInitial = this.firstLetterFormatter(this.props.lastName)
    return (
      <div className={`${styles.avatar_default} ${this.props.additionalClassName && this.props.additionalClassName}`}>
        {`${firstInitial}${secondInitial}`}
      </div>
    )
  }
}
