import { Props } from './types'
import React from 'react'
import cn from 'classnames'

const styles = require('./styles.scss')

const Badge: React.FC<Props> = ({ anchorOrigin, badgeClassName, wrapperClassName, badgeContent, children, color, onClick }) => {
  const horizontal = anchorOrigin.horizontal
  const vertical = anchorOrigin.vertical

  const badgeWrapperClassNames = cn(styles.badgeWrapper, wrapperClassName)
  const badgeClassNames = cn(styles.badgeContent,
    badgeClassName,
    { [styles.absolute]: children != null },
    { [styles.clickable]: onClick != null },
    { [styles.left]: horizontal === 'left' },
    { [styles.right]: horizontal === 'right' },
    { [styles.top]: vertical === 'top' },
    { [styles.bottom]: vertical === 'bottom' }
  )

  return (
    <span className={badgeWrapperClassNames} onClick={onClick}>
      {children}
      <span className={badgeClassNames} style={{ backgroundColor: color }}>
        {badgeContent}
      </span>
    </span>
  )
}

Badge.defaultProps = {
  color: '#EB4F4F',
  anchorOrigin: { horizontal: 'right', vertical: 'top' }
}

export default Badge
