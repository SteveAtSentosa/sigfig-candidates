import * as React from 'react'

import Button from '#/components/Button'

const styles = require('./styles.scss')

interface Props {
  name?: string
  submitButtonName?: string
  onSubmit: () => void
  onFinishEdit?: () => void
  children: any
}

export default class QuickEdit extends React.PureComponent<Props> {

  onSubmit = () => {
    this.props.onSubmit()
    if (this.props.onFinishEdit) {
      this.props.onFinishEdit()
    }
  }

  render () {
    return (
      <div className={styles.quick_edit}>
        <h3>{this.props.name}</h3>
        {this.props.children}
        <div className={styles.quick_edit_footer}>
          <Button onClick={this.onSubmit}>{this.props.submitButtonName ? this.props.submitButtonName : 'edit'}</Button>
        </div>
      </div>
    )
  }
}
