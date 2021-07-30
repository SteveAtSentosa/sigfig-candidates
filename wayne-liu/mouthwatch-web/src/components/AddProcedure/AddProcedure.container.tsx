import { ActionProps, OwnProps, StateProps } from './types'
import { ClearProviders, GetProvidersForSelectedPatient } from '#/actions/patients'

import { AppState } from '#/redux'
import { CreateProcedure } from '#/actions/procedures'
import Form from './AddProcedure'
import { LoadList } from '#/actions/procedurecodes'
import { connect } from 'react-redux'

export default connect<StateProps, ActionProps, OwnProps, AppState>(
  (state: AppState) => ({
    creating: state.procedures.creating,
    providers: state.patients.availableProviders,
    procedureCodes: state.procedurecodes.data
  }),
  {
    createProcedure: CreateProcedure,
    clearProviders: ClearProviders,
    getProvidersForSelectedPatient: GetProvidersForSelectedPatient,
    getProcedureCodes: LoadList
  }
)(Form)
