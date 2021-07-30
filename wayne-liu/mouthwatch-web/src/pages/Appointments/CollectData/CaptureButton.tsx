import * as React from 'react'

import { Link, RouteComponentProps, matchPath, withRouter } from 'react-router-dom'

const styles = require('./collect.scss')

interface CaptureProps extends RouteComponentProps {
  match: {
    isExact: boolean
    params: {
      [k: string]: void | string
    }
    path: string
    url: string
  }
}

const CaptureButton = withRouter((props: CaptureProps) => {
  const match = matchPath<{patientId: string, apptId: string}>(props.location.pathname, {
    path: '/patients/appointments_detail/:patientId/appointment/:apptId',
    exact: false,
    strict: false
  })
  const { patientId, apptId } = match.params
  return (
    <div className={styles.capture}>
      <Link to={`/capture/${patientId}/appointment/${apptId}`}>
        <div className={styles.imageWrapper}>
          <img src='/static/images/icon_quick_add.png' />
        </div>
        <div className={styles.caption}>Capture New Images</div>
      </Link>
    </div>
  )
})

export default CaptureButton
