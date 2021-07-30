import * as React from 'react'

import AudioTable from '#/components/Table/AudioTable'
import { EntityId } from '#/types'
const styles = require('./styles.scss')

interface Props {
  appointmentId: EntityId
}

const AudioWidget = (props: Props) => {
  return (
    <div className={styles.audioWidget}>
      <AudioTable appointmentId={props.appointmentId} />
    </div>
  )
}

export default AudioWidget
