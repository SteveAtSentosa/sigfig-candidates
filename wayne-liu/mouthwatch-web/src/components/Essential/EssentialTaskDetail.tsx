import * as React from 'react'

import { Column, Grid } from '#/components/BSGrid'

import EditTaskForm from '#/components/Form/Task/EditTaskForm'
import { EssentialTaskModal } from '#/components/Essential'
import Toolbar from '#/components/Toolbar'
import cn from 'classnames'

const styles = require('#/pages/Tasks/styles.scss')

const EssentialTaskDetail: React.FC = () => {
  const currentTask = {
    type: '',
    details: '',
    due_date: '',
    priority: 'low',
    status: '',
    created_at: '',
    updated_at: '',
    created_by_id: '',
    updated_by_id: '',
    not_time_set: true,
    time: null
  }

  return (
    <div>
      <Toolbar showUpgradeBadge={true} />
      <EssentialTaskModal />
      <Grid className={cn(styles.gridWrapper, 'no-gutters', styles.taskDetailWrapper)}>
        <Column col={12} md={8}>
          <div className={styles.formWrapper}>
            <EditTaskForm initialValues={currentTask} />
          </div>
        </Column>
        <Column col={12} md={4}>
          <div className={styles.metadata}>
            <h6>Task Details</h6>
            <div>
              <span className={styles.key}>Created by: </span>
            </div>
            <div>
              <span className={styles.key}>Date created: </span>
            </div>
            <div>
              <span className={styles.key}>Date udpated: </span>
            </div>
            <div>
              <span className={styles.key}>Current status: </span>
            </div>
            <div>
              <span className={styles.key}>Appointment: </span>
            </div>
          </div>
        </Column>
      </Grid>
    </div>
  )
}

export default EssentialTaskDetail
