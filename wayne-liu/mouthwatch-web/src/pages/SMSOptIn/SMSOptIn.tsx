import { FormData, TextAlerts } from './Forms'

import { AppState } from '#/redux'
import Button from '#/components/Button'
import Container from '#/components/Container'
import Copyright from '#/components/Copyright'
import { GroupLogo } from '#/components/PatientPortalHeader/GroupLogo'
import { Loads } from '#/components/Loader'
import { Patient } from '#/types'
import { Props } from './types'
import React from 'react'
import { Redirect } from 'react-router-dom'
import { useSelector } from 'react-redux'

const styles = require('./styles.scss')
const qs = require('query-string')

const SMSOptIn: React.FC<Props> = (props) => {
  const { updateSMSOptStatus, history, auth, sendTextAlerts } = props

  const urlParams = qs.parse(props.history.location.search)
  const patientId = urlParams.patientId
  const patient = useSelector<AppState, Patient>(state => state.patients.data.find(p => p.id === patientId))

  const handleTextAlertsSubmit = ({ send_text_alerts, phone }: FormData) => {
    updateSMSOptStatus({
      sms_opt_in: send_text_alerts,
      phone: send_text_alerts ? phone : undefined,
      is_registration: true,
      after: () => history.push('/patient-chat')
    })
  }

  if (!patient || !urlParams) {
    return <Redirect to='/patient-login' />
  }

  const renderTextAlerts = () => (
    <TextAlerts.Form
      onSubmit={handleTextAlertsSubmit}
      initialValues={{ phone: patient.phone2 }}
      showPhoneField={sendTextAlerts}
    />
  )

  return (
    <Loads when={!auth.authing}>
      {() =>
        <div className={styles.ppRegister}>
          <div className={styles.logoHolder}>
            <GroupLogo groupId={auth.data.account.group_id} />
          </div>
          <Container className={styles.container}>
            {renderTextAlerts()}
            <div className={styles.haveAccount}>
              <p>Already have an account?</p>
              <Button className={styles.loginBtn} onClick={() =>
                history.push('/patient-login')} secondary inline transparent>Login</Button>
            </div>
          </Container>
          <Copyright />
        </div>
      }
    </Loads>
  )
}

export default SMSOptIn
