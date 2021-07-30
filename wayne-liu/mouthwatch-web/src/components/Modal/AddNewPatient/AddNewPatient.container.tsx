import { OwnProps, StateProps } from './types'

import AddNewPatientModal from './AddNewPatient'
import { AppState } from '#/redux'
import { connect } from 'react-redux'
import { formValueSelector } from 'redux-form'
import { isPatientLegal } from '#/utils'
import { stateNamespace } from '#/reducers/patients'
import validator from 'validator'
import withUserGroups from '#/hocs/withUserGroups'

const selector = formValueSelector('addNewPatient')

export default withUserGroups(connect<StateProps, {}, OwnProps, AppState>(
  (state: AppState) => {
    const email = selector(state, 'email')
    const hasEmail = email && email.length > 0 && validator.isEmail(email)

    const dob = selector(state, 'dob')
    const isUnderage = dob && !isPatientLegal(dob)

    return {
      isUnderage: isUnderage,
      hasValidEmail: hasEmail,
      account: state.auth.data.account,
      posting: state[stateNamespace].posting,
      error: state[stateNamespace].error
    }
  }
)(AddNewPatientModal))
