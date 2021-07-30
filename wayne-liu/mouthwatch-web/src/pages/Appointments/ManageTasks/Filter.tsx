import * as React from 'react'

import { AppState } from '#/redux'
import { EntityId } from '#/types'
import FilterButton from './FilterButton'
import { SortAndFilterTasks } from '#/actions/tasks'
import { connect } from 'react-redux'

const styles = require('./manage.scss')

interface Props {
  appointmentId: EntityId
}
interface StateProps {
  accountId: EntityId
}
interface ActionProps {
  sortAndFilterTasks: typeof SortAndFilterTasks
}

class Filter extends React.Component<Props & StateProps & ActionProps> {

  handleSubmit = (values: object) => {
    const { accountId, appointmentId } = this.props
    if (!values['filter_by_status']) {
      values['filter_by_status'] = { label: 'All', value: 'all' }
    }
    this.props.sortAndFilterTasks({ filters: values, accountId, appointmentId })
  }

  render () {
    return (
      <div className={styles.filterTask}>
        <FilterButton handleSubmit={this.handleSubmit} />
      </div>
    )
  }
}

export default connect<StateProps, ActionProps, Props, AppState>(
  (state: AppState) => ({
    accountId: state.auth.data.account.id
  }),
  {
    sortAndFilterTasks: SortAndFilterTasks
  }
)(Filter)
