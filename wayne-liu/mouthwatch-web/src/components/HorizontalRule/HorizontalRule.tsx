import * as React from 'react'

import { Props } from './types'

const styles = require('./styles.scss')

const HorizontalRule: React.FunctionComponent<Props> = props => {
  return (
    <div id='hr' style={{ width: props.width }} className={styles.horizontalRule}>
      <div/>
      <span>{props.text}</span>
      <div/>
    </div>
  )
}

HorizontalRule.defaultProps = {
  text: 'or',
  width: '100%'
}

export default HorizontalRule
