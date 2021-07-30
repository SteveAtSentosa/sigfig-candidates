import React, { useState } from 'react'

import Add from '#/components/AddTask'
import Button from '#/components/Button'
import DeleteAppointmentModal from '#/pages/Appointments/modals/DeleteAppointment'
import { EntityId } from '#/types'
import Filter from './Filter'
import TaskList from './TaskList'
import UnsavedChanges from '#/components/UnsavedChanges'

const styles = require('./manage.scss')

interface Props {
  patientId: EntityId
  appointmentId: EntityId
}

const ManageTasks: React.FunctionComponent<Props> = (props) => {
  const [ deleteModalIsOpen, setDeleteModalIsOpen ] = useState(false)
  const { patientId, appointmentId } = props

  return (
    <div className={styles.taskWrapper}>
      <UnsavedChanges formName='add_new_task_appt' />
      <Filter appointmentId={appointmentId} />
      <Add id={patientId} appointmentId={appointmentId} />
      <TaskList appointmentId={appointmentId} />
      <div className={styles.section}>
        <div className={styles.archive_delete}>
          <Button secondary onClick={() => setDeleteModalIsOpen(true)}>Delete Appointment</Button>
        </div>
      </div>
      <DeleteAppointmentModal
        close={() => setDeleteModalIsOpen(false)}
        isOpen={deleteModalIsOpen}
        patientId={patientId}
        appointmentId={appointmentId}
      />
    </div>
  )
}

export default ManageTasks
