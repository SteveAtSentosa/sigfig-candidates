import * as React from 'react'

import { AddTaskForm } from '#/components/AddTask'
import EssentialTaskModal from '#/components/Essential/EssentialTaskModal'
import FilterButton from '#/pages/Patients/Tasks/FilterButton'
import { TaskListHeader } from '#/components/List/Tasks/Header'

const styles = require('#/pages/Patients/Tasks/tasks.scss')

const noAction = () => {
  return null
}

const EssentialTasks: React.FC = () => (
  <div style={{ position: 'relative', height: '75%' }}>
    <div className={styles.taskWrapper}>
      <div className={styles.filterTask}>
        <FilterButton disabled handleSubmit={noAction} />
      </div>
      <AddTaskForm
        onSubmit={noAction}
        initialValues={{
          patient: { label: 'Test Patient', value: '' },
          due_date: new Date().setHours(0, 0, 0, 0),
          priority: 'Low',
          providerOptions: []
        }}
        enableReinitialize
      />
      <ul>
        <li>
          <TaskListHeader />
        </li>
      </ul>
    </div>
    <EssentialTaskModal />
  </div>
)

export default EssentialTasks
