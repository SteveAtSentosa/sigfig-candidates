import * as React from 'react'

import { Group } from '#/types'
import { LogoUpload } from './Account'

const styles = require('./titles.scss')

interface Props {
  entity: Group
  entityLabel: string
  onFileChosen: (e) => void
  showUpgradeTooltip?: boolean
}

export const LogoTitle: React.FC<Props> = ({ entity, entityLabel, onFileChosen, showUpgradeTooltip }) => {
  return (
    <div className={styles.logoTitle}>
      {
        entity ?
        <>
          {
            entity.media.length > 0 &&
            <div className={styles.picture}>
              <LogoUpload
                onFileChosen={onFileChosen}
                uploadLogoText='Update Logo'
                showUpgradeTooltip={showUpgradeTooltip}
              />
            </div>
          }
          <div className={styles.title}>
            <h2>{entity.name}</h2>
          </div>
        </>
        :
        <h2>Create New {entityLabel}</h2>
      }
    </div>
  )
}
