import React, { useEffect, useRef } from 'react'

import { Props } from './types'
import Tippy from '@tippyjs/react'
import { UpgradeSubscriptionLink } from '#/consts'
import cn from 'classnames'

require('!style-loader!css-loader!tippy.js/dist/tippy.css')
require('!style-loader!css-loader!tippy.js/themes/light.css')

const styles = require('./styles.scss')

const EssentialTooltip: React.FC<Props> = ({ children, wrapperClassName, content, placement, enabled, disableClickOnChildren }) => {
  const refTrigger = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    if (refTrigger.current && disableClickOnChildren) {
      const child = refTrigger.current.children[0] as HTMLElement
      child.addEventListener('click', onChildClick)
      return () => {
        child.removeEventListener('click', onChildClick)
      }
    }
  }, [refTrigger.current, disableClickOnChildren])

  if (!enabled) return <>children</>

  function onChildClick (ev: MouseEvent) {
    ev.stopPropagation()
  }

  const html = (
    <div className={styles.wrapper}>
      <div className={styles.content}>{content}</div>
      <a
        target='_blank'
        className={styles.learnMore}
        href={UpgradeSubscriptionLink}
      >
        Learn More
      </a>
    </div>
  )

  return (
    <Tippy
      arrow
      content={html}
      interactive
      placement={placement}
      theme='light'
    >
      <span ref={refTrigger} className={cn(styles.trigger, wrapperClassName)}>
        {children}
      </span>
    </Tippy>
  )
}

EssentialTooltip.defaultProps = {
  placement: 'top',
  enabled: true,
  disableClickOnChildren: true
}

export default EssentialTooltip
