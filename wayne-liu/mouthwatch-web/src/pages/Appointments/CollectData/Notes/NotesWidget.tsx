import * as React from 'react'
import { Note, EntityId } from '#/types'
import NotesTable from '#/components/Table/NotesTable'

const styles = require('./styles.scss')

interface NotesWidgetProps {
  notes: Note[]
  fetching: boolean
  appointmentId: EntityId
}

export default class NotesWidget extends React.PureComponent<NotesWidgetProps> {
  render () {
    return (
      <div className={styles.notesWidget}>
        <NotesTable appointmentId={this.props.appointmentId} data={this.props.notes} fetching={this.props.fetching} />
      </div>
    )
  }
}
