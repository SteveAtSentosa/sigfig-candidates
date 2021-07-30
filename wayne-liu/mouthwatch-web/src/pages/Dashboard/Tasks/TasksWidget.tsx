import * as React from 'react'
import TasksTable from './TasksTable'
const styles = require('./styles.scss')

export default class TasksWidget extends React.Component<{}> {

  render () {
    return (
      <div className={styles.tasksWidget}>
        <TasksTable />
      </div>
    )
  }

}
