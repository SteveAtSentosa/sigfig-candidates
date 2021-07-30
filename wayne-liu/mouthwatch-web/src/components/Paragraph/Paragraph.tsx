import * as React from 'react'
const styles = require('./styles.scss')

interface Props {
  children?: React.ReactNode
  small?: boolean
}

export default ({ children, small = false }: Props) => {
  const smallClass = small ? styles.small : ''
  return (
    <p className={`${styles.paragraph} ${smallClass}`}>
      {children}
    </p>
  )
}
