import React, { useState } from 'react'
import { ConnectedUpgradeBadge } from '#/components/Badge'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/pro-light-svg-icons'
import { UpgradeSubscriptionLink } from '#/consts'
const styles = require('./styles.scss')

type Props = {}

const BANNER_CLOSED = 'BANNER_CLOSED'
const EssentialBanner: React.FC<Props> = () => {
  const [visible, setVisible] = useState(sessionStorage.getItem(BANNER_CLOSED) !== 'TRUE')

  if (!visible) return null

  function handleClose () {
    sessionStorage.setItem(BANNER_CLOSED, 'TRUE')
    setVisible(false)
  }

  return (
    <div className={styles.banner}>
      <span className={styles.message}>Want to get even more flexibility and enhanced features? Upgrade to&nbsp;<strong>Professional.</strong></span>

      <div className={styles.actions}>
        <a
          className={styles.learnMore}
          href={UpgradeSubscriptionLink}
          target='_blank'
        >
          Learn More
        </a>
        <ConnectedUpgradeBadge badgeClassName={styles.upgradeBadge} />
      </div>

      <div className={styles.closeButton} onClick={handleClose}>
        <FontAwesomeIcon icon={faTimes} />
      </div>
    </div>
  )
}

export default EssentialBanner
