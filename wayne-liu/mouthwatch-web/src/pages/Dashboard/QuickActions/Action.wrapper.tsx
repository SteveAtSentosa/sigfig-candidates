import * as React from 'react'

const styles = require('./styles.scss')

interface ActionProps {
  icon: React.ReactNode
  label: string
  onClick?: () => void
}

export const Action = (props: ActionProps) => (
  <div className={styles.action}>
    <button onClick={props.onClick}>
      <div className={styles.icon}>
        {props.icon}
      </div>
      <div className={styles.label}>
        {props.label}
      </div>
    </button>
  </div>
)
