import * as React from 'react'

import { Appt as Appointment, EntityId, Media } from '#/types'
import { Shorten, getLambdaMediaSrc, isImage, isVideo } from '#/utils'
import { has, isEmpty } from 'lodash'

import { AppState } from '#/redux'
import { OpenMediaViewer } from '#/actions/mediaViewer'
import { connect } from 'react-redux'
import { format } from 'date-fns'

const styles = require('./collect.scss')

interface OwnProps {
  preview?: Media | Error
  token?: string
  mediaIds: string[]
  appointment: Appointment | void
  appointmentId: string
  patientId?: EntityId
}
interface ActionProps {
  openViewer: typeof OpenMediaViewer
}
type Props = OwnProps & ActionProps

class MediaPreview extends React.PureComponent<Props> {

  launch = (preview: Media) => {
    const { mediaIds, appointmentId, patientId } = this.props
    this.props.openViewer({
      initialId: preview.id,
      mediaIds,
      notesOpen: true,
      appointmentId: appointmentId,
      patientId: patientId
    })
  }

  render () {
    const { preview, token, appointment } = this.props

    return (!preview || preview instanceof Error || isEmpty(preview) || !has(appointment, 'provider')) ||
      (
      <section className={styles.mediaPreview}>
        <div
          className={styles.largeImage}
          style={{
            backgroundImage: isImage(preview) ? `url(${getLambdaMediaSrc(preview.id, token)})` : 'none',
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            height: '640px'
          }}
          onClick={() => this.launch(preview)}
        >
        {
          isVideo(preview) &&
          <>
            <video src={getLambdaMediaSrc(preview.id, token)} style={{ maxWidth: '100%', width: '100%', height: '640px', objectFit: 'cover' }} />
          </>
        }
        </div>

        <div className={styles.metadata}>
          <span className={styles.filename}>{Shorten(preview.caption || preview.file_name, 25)}</span>
          <div className={styles.property}>
            <label>Type</label>
            <span className={styles.type}>{preview.mime_type}</span>
          </div>
          <div className={styles.property}>
            <label>Date Added</label>
            <span>{format(preview.created_at, 'MM/DD/YYYY @ h:mm a')}</span>
          </div>
          {
            appointment &&
            <>
              <div className={styles.property}>
                <label>Provider</label>
                <span>{`${appointment.provider.first_name} ${appointment.provider.last_name}`}</span>
              </div>
              <div className={styles.property}>
                <label>Location</label>
                <span>{appointment.location && appointment.location.name}</span>
              </div>
            </>
          }

          <div className={styles.property}>
            <label>Tooth Number</label>
            <span>{preview.tooth ? preview.tooth.join(', ') : '' }</span>
          </div>
          <div className={styles.property}>
            <label>Notes</label>
            <span>{preview.notes.length}</span>
            <div className={styles.notesViewAdd}>
              <a href='#' onClick={() => this.launch(preview)}>View</a> | <a href='#' onClick={() => this.launch(preview)}>Add</a>
            </div>
          </div>
        </div>
      </section>
    )
  }

}

export default connect<{}, ActionProps, OwnProps, AppState>(
  null,
  {
    openViewer: OpenMediaViewer
  }
)(MediaPreview)
