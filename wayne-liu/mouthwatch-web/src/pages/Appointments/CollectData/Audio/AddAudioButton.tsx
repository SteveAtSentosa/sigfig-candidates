import * as React from 'react'

import { RouteComponentProps, matchPath, withRouter } from 'react-router-dom'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/pro-light-svg-icons'

const styles = require('./styles.scss')

interface RouteParams {
  apptId: string
  patientId: string
}
type Props = RouteComponentProps<{}>

interface State {}

class AddDocButton extends React.PureComponent<Props, State> {
  get match () {
    return matchPath<RouteParams>(this.props.location.pathname, {
      path:   ['/patients/detail/:patientId', '/patients/appointments_detail/:patientId/appointment/:apptId'],
      exact: false,
      strict: false
    }) || { params: { patientId: null, apptId: null } }
  }

  handleAddAudioClick = () => {
    const { params: { apptId, patientId } } = this.match
    this.props.history.push(`/audio/patient/${patientId}/appointment/${apptId}`)
  }

  render () {
    return (
      <div>
        {
          window.MediaRecorder &&
          <div className={styles.button} onClick={this.handleAddAudioClick}>
            <FontAwesomeIcon icon={faPlus}/>
            <span className={styles.title}>Add</span>
          </div>
      }
      </div>
    )
  }
}

export default withRouter(AddDocButton)
