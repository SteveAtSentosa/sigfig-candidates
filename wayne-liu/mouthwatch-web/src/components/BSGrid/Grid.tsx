import * as React from 'react'

import cn from 'classnames'

interface GridProps {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

export const Grid = ({ children, className = '', style = {} }: GridProps) => (
  <div className={`row ${className}`} style={style}>
    {children}
  </div>
)

type ColumnSizing = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12

interface ColumnProps {
  children: React.ReactNode
  col?: ColumnSizing
  xs?: ColumnSizing
  sm?: ColumnSizing
  md?: ColumnSizing
  lg?: ColumnSizing
  xl?: ColumnSizing
  className?: string
}

export const Column = (props: ColumnProps) => {
  const classNames = cn(props.className, 'col', {
    [`col-${props.col}`]: props.col,
    [`col-xs-${props.xs}`]: props.xs,
    [`col-sm-${props.sm}`]: props.sm,
    [`col-md-${props.md}`]: props.md,
    [`col-lg-${props.lg}`]: props.lg,
    [`col-xl-${props.xl}`]: props.xl
  })

  return (
    <div className={classNames}>
      {props.children}
    </div>
  )
}

export const ColumnBreak = (props: { displayAt?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' }) => {
  const { displayAt = 'sm' } = props
  const classNames = cn('w-100', 'd-none', {
    [`d-${displayAt}-block`]: displayAt
  })
  return <div className={classNames}></div>
}
