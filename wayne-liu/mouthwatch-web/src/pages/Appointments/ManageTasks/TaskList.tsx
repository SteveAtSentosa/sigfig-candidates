import * as React from 'react'

import { ClearTaskFilters, ClearTaskList, GetTasks } from '#/actions/tasks'

import { AppState } from '#/redux'
import { EntityId } from '#/types'
import List from '#/components/List/Tasks'
import Loader from '#/components/Loader'
import { connect } from 'react-redux'

interface OwnProps {
  appointmentId: EntityId
}
interface StateProps {
  fetching: boolean
  creatingTask: boolean
  taskIds: EntityId[]
}
interface ActionProps {
  clearTasks: typeof ClearTaskList
  loadTasks: typeof GetTasks
  clearFilters: typeof ClearTaskFilters
}

class TaskList extends React.Component<OwnProps & StateProps & ActionProps> {

  loadTasks = () => {
    this.props.loadTasks({
      associations: [
        { model: 'appointment', where: [{ and: [{ prop: 'id', comp: '=', param: this.props.appointmentId }] }], associations: [{ model: 'patient' }] },
        { model: 'patient' }
      ],
      order: 'due_date',
      useV2: true
    })
  }

  componentDidMount () {
    this.loadTasks()
  }

  componentDidUpdate (prevProps) {
    // reload patient after adding a new task
    if (prevProps.creatingTask && !this.props.creatingTask) {
      this.props.clearFilters()
      this.loadTasks()
    }
  }

  componentWillUnmount () {
    this.props.clearTasks()
  }

  render () {
    const { fetching, creatingTask, taskIds } = this.props
    return (
      fetching || creatingTask || !taskIds
      ?
      <Loader />
      :
      <List dataIds={taskIds} />
    )
  }
}

export default connect<StateProps, ActionProps, OwnProps, AppState>(
  (state: AppState) => ({
    fetching: state.tasks.list.fetching,
    creatingTask: state.tasks.meta.creating,
    taskIds: state.tasks.list.dataIds
  }),
  {
    clearTasks: ClearTaskList,
    loadTasks: GetTasks,
    clearFilters: ClearTaskFilters
  }
)(TaskList)
