import React, { useState } from 'react'
import { BREAKPOINT_BS_SM } from '#/consts'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import ResizeDetector from 'react-resize-detector'
import { UpgradeSubscriptionContainer } from '#/components/EssentialModal'
import cn from 'classnames'
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons'

const styles = require('./styles.scss')

type Props = {
  onClick?: (ev: React.MouseEvent | React.TouchEvent) => void
}

const copy = ['Task Management', 'Multi-Party Video Conferences', 'Treatment Plan Builder', 'Procedure Codes', 'Video and Audio Messages', 'Intraoral Camera Integration', 'Group Message Channels', 'And More!']

const EssentialTaskWidget: React.FC<Props> = ({ onClick }) => {
  const [width, setWidth] = useState(0)

  return (
    <div className={cn(styles.modal, { [styles.sm]: width <= BREAKPOINT_BS_SM })}>
      <div className={styles.textSection}>
        <img className={styles.image} src='/static/images/features.svg' />
        <div>
          <div className={styles.title}>
            Unlock advanced features with
            <br /><strong>TeleDent Professional</strong>
          </div>
          <div className={styles.description}>
            TeleDent Professional offers tools to increase collaboration, streamline workflows, and improve communication between patients and colleagues.
            <br />
            <br />
            With <strong>Professional,</strong> you have access to:
          </div>
        </div>
      </div>

      <div className={styles.copies}>
        {copy.map((e, i) => (
          <div key={i} className={styles.copy}>
            <FontAwesomeIcon className={styles.icon} icon={faCheckCircle} />
            {e}
          </div>
        ))}
      </div>
      <button className={styles.button} onClick={onClick}>Upgrade Now</button>

      <ResizeDetector handleWidth onResize={setWidth} />
    </div>
  )
}

export const ConnectedEssentialTaskWidget: React.FC = () => {
  return (
    <UpgradeSubscriptionContainer>
      <EssentialTaskWidget />
    </UpgradeSubscriptionContainer>
  )
}


export default ConnectedEssentialTaskWidget
