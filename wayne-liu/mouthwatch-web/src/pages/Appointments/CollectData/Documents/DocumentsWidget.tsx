import * as React from 'react'
import DocumentsTable from '#/components/Table/DocumentsTable'
import { Media } from '#/types'
const styles = require('./styles.scss')

interface Props {
  media: Media[]
  fetching: boolean
}

const DocumentsWidget = (props: Props) => {
  const allowedDocumentTypes = [
    'application/pdf',
    'text/plain',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/csv',
    'application/rtf',
    'text/rtf',
    'model/stl',
    'application/octet-stream'
  ]

  return (
    <div className={styles.docsWidget}>
      <DocumentsTable media={props.media} fetching={props.fetching} allowedDocumentTypes={allowedDocumentTypes} />
    </div>
  )
}

export default DocumentsWidget
