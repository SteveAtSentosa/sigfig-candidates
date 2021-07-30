import * as React from 'react'

import cn from 'classnames'

interface Props {
  children: React.ReactNode
  flex?: boolean
  grow?: boolean
  fullWidth?: boolean
  className?: string
  patientHeader?: boolean
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void
}

export default ({ children, flex, grow, fullWidth, patientHeader, className, onClick }: Props) => {
  const classNames = cn('container', {
    ['flex']: flex,
    ['grow']: grow,
    ['fullWidth']: fullWidth,
    ['patientHeader']: patientHeader,
    [className]: className
  })

  return (
    <div data-ignoreclick='true' onClick={onClick} className={classNames}>
      {children}
    </div>
  )
}
