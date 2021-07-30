import * as React from 'react'

import Loader from './Loader'

const styles = require('./styles.scss')

interface Props {
  className?: string
  size?: number
  when: boolean
  children: any
  color?: string
}

/*
  React typescript docs explicitly state that we should use any as typing for children.
  However this component expects a function.
  Component that conditionally shows it's children. Alleivates the need to perform ugly checks.
  ie: this.props.account ? Loader : SomeComponent
*/

const Loads = (props: Props) => {
  return (
    !props.when
    ? (
      <div className={`${styles.loading} ${props.className}`}>
        <Loader size={props.size} color={props.color} />
      </div>
    )
    : <> {props.children()} </>
  )
}

export default Loads
