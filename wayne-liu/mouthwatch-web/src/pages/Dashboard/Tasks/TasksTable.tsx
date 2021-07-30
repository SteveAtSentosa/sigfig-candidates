import * as React from 'react'

import { ClearTaskList, SortAndFilterTasks, UpdateTask } from '#/actions/tasks'
import { EntityId, TaskFromAPI as Task } from '#/types'
import { PatchedEntity, SortOrder } from '#/api/types'

import AccountAvatar from '#/components/AccountAvatar'
import { AppState } from '#/redux'
import { FilterObject } from '#/actions/types'
import Icon from '#/components/Icon'
import { Link } from 'react-router-dom'
import Loader from '#/components/Loader'
import Table from '#/components/Table'
import { connect } from 'react-redux'
import { getUTCDateString } from '#/utils'

const styles = require('./styles.scss')

interface OwnProps {}
interface ActionProps {
  sortAndFilterTasks: typeof SortAndFilterTasks
  updateTask: typeof UpdateTask
  clearTasks: typeof ClearTaskList
}
interface StateProps {
  accountId: EntityId
  taskIds: EntityId[]
  tasksById: { [id: string]: Task }
  fetching: boolean
  filters: FilterObject
  token: string
  taskIsBeingCreated: boolean
}

interface State {
  order: string
  sort: SortOrder
  orderAs: string
}

type Props = ActionProps & StateProps & OwnProps

class TasksTable extends React.PureComponent<Props, State> {
  state = {
    order: 'due_date',
    sort: 'ASC' as SortOrder,
    orderAs: ''
  }

  load = (where?: FilterObject) => {
    const { accountId, filters, sortAndFilterTasks } = this.props
    const { order, sort, orderAs } = this.state
    sortAndFilterTasks({
      filters: where || filters,
      order,
      sort,
      orderAs,
      accountId
    })
  }

  sortBy = (sort: SortOrder) => (order: string, orderAs: string) => {
    this.setState({ sort, order, orderAs }, () => {
      this.load()
    })
  }

  viewButton = (rowData: Task, isOpen?: boolean, clickHandler?: () => void) => {
    const data: PatchedEntity = { 'status' : { value: 'Complete', op: 'replace' } }
    const { order, sort } = this.state
    return !isOpen ? <div className={styles.icon}><Icon name='more_horiz' onMouseEnter={clickHandler} onClick={clickHandler}/></div> :
    <div className={styles.menu}>
      <span onClick={() => this.props.updateTask({ id: rowData.id, data, order, sort, updated_at: rowData.updated_at })}>Done</span> | <Link to={`/tasks/detail/${rowData.id}`}>View</Link> | <Link to={`/tasks/detail/${rowData.id}`}>Edit</Link>
    </div>
  }

  componentDidMount () {
    this.props.clearTasks()
    this.load({ filter_by_status: { label: 'Open', value: 'Open' }, filter_by_assignee: { assignee_myself: true } })
  }

  shouldFetchTaskList = (prevProps: Props) => {
    if (prevProps.taskIsBeingCreated && !this.props.taskIsBeingCreated) {
      this.load()
    }
  }

  componentDidUpdate (prevProps: Props) {
    this.shouldFetchTaskList(prevProps)
  }

  private get sortedTasks () {
    const customOrder = {
      'Low': 0,
      'Medium': 1,
      'High': 2
    }
    const { order, sort } = this.state
    const { taskIds, tasksById } = this.props
    const tasks = taskIds.map(id => tasksById[id])

    switch (order) {
      case 'priority':
        return tasks.sort((a, b) => (sort === 'ASC' ? customOrder[a.priority] - customOrder[b.priority] : customOrder[b.priority] - customOrder[a.priority]))
      case 'assignee':
        const sorted = tasks.sort((tA, tB) => (tA.assignments[0].assigned_to.last_name + tA.assignments[0].assigned_to.first_name).localeCompare((tB.assignments[0].assigned_to.last_name + tB.assignments[0].assigned_to.first_name)))
        return sort === 'ASC' ? sorted : sorted.reverse()
      default:
        return tasks
    }
  }

  private get columns () {
    return [
      {
        name: 'Priority',
        accessor: 'priority',
        renderCell: (priority) => {
          return (
            <div className={styles.taskPriority}>
              <div className={styles[`${priority}`]}>{priority}</div>
            </div>
          )
        },
        sortBy: (sort) => this.sortBy(sort)('priority', '')
      },
      {
        name: 'Due Date',
        accessor: 'due_date',
        renderCell: (date) => {
          return <div>{getUTCDateString(date)}</div>
        },
        sortBy: (sort) => this.sortBy(sort)('due_date', '')
      },
      {
        name: 'Summary',
        accessor: 'type'
      },
      {
        name: 'Provider',
        accessor: 'assignments',
        sortBy: (sort) => this.setState({ sort, order: 'assignee' }),
        renderCell: (assignments) => {
          const account = assignments[0].assigned_to
          return (
            <div className={styles.taskAssignee}>
              <AccountAvatar height={30} width={30} type='provider' entityId={account.id}/>
            </div>
          )
        }
      }
    ]
  }

  componentWillUnmount () {
    this.props.clearTasks()
  }

  render () {
    const { taskIds, fetching } = this.props
    return (

      <div>
      {
        !taskIds
        ?
        <Loader />
        :
        <Table
          name='tasks'
          defaultSortByAccessor={'due_date'}
          className={styles.task_table}
          data={this.sortedTasks}
          fetching={fetching}
          columns={this.columns}
          actionColumnName={' '}
          actionColumn={this.viewButton}
        />
      }

      </div>

    )
  }
}

export default connect<StateProps, ActionProps, OwnProps, AppState>(
  (state: AppState) => ({
    taskIds: state.tasks.list.dataIds,
    tasksById: state.tasks.byId,
    fetching: state.tasks.list.fetching,
    accountId: state.auth.data && state.auth.data.account.id,
    filters: state.tasks.list.filters,
    token: state.auth.data && state.auth.data.token,
    taskIsBeingCreated: state.tasks.meta.creating
  }),
  {
    sortAndFilterTasks: SortAndFilterTasks,
    clearTasks: ClearTaskList,
    updateTask: UpdateTask
  }
)(TasksTable)
