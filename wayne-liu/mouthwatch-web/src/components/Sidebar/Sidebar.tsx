import * as React from 'react'
const styles = require('./styles.scss')

interface Props {
  children: React.ReactNode
  className?: string
}

export default (props: Props) => (
  <div className={`${styles.sidebar} ${props.className}`}>
    {props.children}
  </div>
)
