import * as React from 'react'

import { Appt as Appointment, EntityId, ProcedureFromForm as Procedure } from '#/types'

import AddProcedure from '#/components/AddProcedure'
import { AppState } from '#/redux'
import Button from '#/components/Button'
import DeleteAppointmentModal from '#/pages/Appointments/modals/DeleteAppointment'
import List from '#/components/List/Procedures'
import { LoadList } from '#/actions/procedures'
import Loader from '#/components/Loader'
import UnsavedChanges from '#/components/UnsavedChanges'
import { connect } from 'react-redux'
import { selectors } from '#/actions/appointments'

const styles = require('#/pages/Appointments/styles.scss')

interface Props {
  appointmentId: EntityId
  patientId: EntityId
}

interface StateProps {
  appointment: Appointment | void
  fetching: boolean
  updating: boolean
  procedures: Procedure[]
}

interface ActionProps {
  loadProcedures: typeof LoadList
}

interface State {
  deleteModalIsOpen: boolean
}

class AddCodes extends React.Component<Props & StateProps & ActionProps, State> {

  state = {
    deleteModalIsOpen: false
  }

  openDeleteModal = () => this.setState({ deleteModalIsOpen: true })
  closeDeleteModal = () => this.setState({ deleteModalIsOpen: false })

  componentDidMount () {
    this.props.loadProcedures({
      where: [ { prop: 'appointment_id', comp: '=', param: this.props.appointmentId }],
      associations: [{ model: 'account', as: 'provider', associations: [{ model: 'media', as: 'media', where: [{ prop: 'type', comp: '=', param: 'acct-avatar' }] }] }],
      order: 'created_by_id',
      sort: 'ASC'
    })
  }

  render () {
    return (
      <div>
        <UnsavedChanges formName='add_procedure' />
        {
          !this.props.appointment
          ? <Loader />
          : <AddProcedure
              patientId={this.props.patientId}
              appointment={this.props.appointment}
              initialValues={{ status: 'Proposed' }}
              appointmentId={this.props.appointmentId}
            />
        }
        {
          !this.props.procedures || this.props.fetching || this.props.updating
          ? <Loader />
          : <List data={this.props.procedures} patientId={this.props.patientId} />
        }
        <div className={styles.section}>
          <div className={styles.archive_delete}>
            <Button secondary onClick={this.openDeleteModal}>Delete Appointment</Button>
          </div>
        </div>
        <DeleteAppointmentModal
          close={this.closeDeleteModal}
          isOpen={this.state.deleteModalIsOpen}
          patientId={this.props.patientId}
          appointmentId={this.props.appointmentId}
        />
      </div>
    )
  }

}

export default connect<StateProps, ActionProps, Props, AppState>(
  (state: AppState, props) => ({
    appointment: selectors.getById(state, props.appointmentId),
    fetching: state.procedures.fetching,
    updating: state.procedures.updating,
    procedures: state.procedures.data
  }),
  {
    loadProcedures: LoadList
  }
)(AddCodes)
