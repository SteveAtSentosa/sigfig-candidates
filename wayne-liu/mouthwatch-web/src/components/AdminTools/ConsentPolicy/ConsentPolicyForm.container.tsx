import ConsentPolicy, { validate } from './ConsentPolicyForm'
import { FormProps, FormValues, OwnProps, StateProps } from './types'

import { AppState } from '#/redux'
import { connect } from 'react-redux'
import { reduxForm } from 'redux-form'

const ConnectedConsentPolicyForm = connect<StateProps, {}, OwnProps, AppState>(
  (_state: AppState) => ({}),
  {}
)(ConsentPolicy)

export default reduxForm<FormValues, FormProps>({
  validate
})(ConnectedConsentPolicyForm)
