import * as React from 'react'
import { format } from 'date-fns'
import { Audio } from '#/types'
import { msToTime } from '#/utils'
import Table from '#/components/Table'

const styles = require('./styles.scss')

interface Props {
  data: Audio[]
  onListenAudio: (audio: Audio) => void
}

export default class AudioTable extends React.PureComponent<Props> {
  get columns () {
    return [
      {
        name: 'Date',
        accessor: 'created_at',
        renderCell: (date: string) => <div>{format(date, 'MM/DD/YYYY')}</div>
      },
      {
        name: 'Name',
        accessor: 'caption'
      },
      {
        name: 'Duration',
        accessor: 'duration',
        renderCell: (ms: number) => <div>{msToTime(ms, true)}</div>
      }
    ]
  }

  listenButton = (data: Audio) => (
    <div className={styles.viewButton}>
      <a href='#' onClick={this.handleListenClick(data)}>Listen</a>
    </div>
  )

  handleListenClick = (audio: Audio) => () => {
    const { onListenAudio } = this.props
    onListenAudio(audio)
  }

  render () {
    const { data } = this.props

    if (!data || !data.length) {
      return <div className={styles.emptyTable}>No audio has been added to this appointment</div>
    }

    return (
      <div>
        <Table
          name='audio'
          className={styles.audio_table}
          data={data}
          columns={this.columns}
          actionColumnName={' '}
          actionColumn={this.listenButton}
          hideBorder
        />
      </div>
    )

  }
}
