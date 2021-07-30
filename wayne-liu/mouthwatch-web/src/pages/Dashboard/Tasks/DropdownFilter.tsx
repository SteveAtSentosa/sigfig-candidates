import * as React from 'react'
import { connect } from 'react-redux'
import { AppState } from '#/redux'
import { EntityId } from '#/types'
import { SortOrder } from '#/api/types'
import { SortAndFilterTasks } from '#/actions/tasks'
import Dropdown from '#/components/Dropdown'

interface StateProps {
  accountId: EntityId
  order: string
  orderAs: string
  sort: SortOrder
}
interface ActionProps {
  sortAndFilterTasks: typeof SortAndFilterTasks
}

class DropdownFilter extends React.Component<StateProps & ActionProps> {

  createPayload = (e: any) => {
    const { accountId, sortAndFilterTasks, order, orderAs, sort } = this.props
    const value = e.target.value
    const filters = {}
    switch (value) {
      case 'user_open':
        filters['filter_by_status'] = 'Open'
        filters['filter_by_assignee'] = { assignee_myself: true }
        break
      case 'user_complete':
        filters['filter_by_status'] = 'Complete'
        filters['filter_by_assignee'] = { assignee_myself: true }
        break
      case 'user_created':
        filters['created_by_me'] = true
        break
      case 'open':
        filters['filter_by_status'] = 'Open'
        break
      case 'complete':
        filters['filter_by_status'] = 'Complete'
        break
      case 'overdue':
        filters['filter_by_due_date'] = { label: 'currently_overdue', value: 'currently_overdue' }
        break
    }
    sortAndFilterTasks({ filters, order, orderAs, sort, accountId })
  }

  render () {
    return (
      <Dropdown handleChange={this.createPayload}>{[
        {
          text: 'My Open Tasks',
          value: 'user_open'
        },
        {
          text: 'My Completed Tasks',
          value: 'user_complete'
        },
        {
          text: 'Created By Me',
          value: 'user_created'
        },
        {
          text: 'All Open',
          value: 'open'
        },
        {
          text: 'All Completed Tasks',
          value: 'complete'
        },
        {
          text: 'All Overdue Tasks',
          value: 'overdue'
        },
        {
          text: 'All Tasks',
          value: 'all'
        }
      ]}</Dropdown>
    )
  }

}

export default connect<StateProps, ActionProps, {}, AppState>(
  (state: AppState) => ({
    accountId: state.auth.data && state.auth.data.account.id,
    order: state.tasks.list.order,
    orderAs: state.tasks.list.orderAs,
    sort: state.tasks.list.sort
  }),
  {
    sortAndFilterTasks: SortAndFilterTasks
  }
)(DropdownFilter)
