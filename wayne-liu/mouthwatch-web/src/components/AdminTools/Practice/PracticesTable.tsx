import * as Api from '#/api'
import * as GroupActions from '#/actions/groups'
import * as React from 'react'

import { ActionProps, OwnProps, State, StateProps } from './types'
import { Link, withRouter } from 'react-router-dom'
import { getLambdaGroupLogoSrc, isSuperUser } from '#/utils'

import { AccountEditPreview } from '#/components/AdminTools/Account'
import { AdminToolsSearchPractices } from '#/actions/practices'
import { AppState } from '#/redux'
import { Direction } from '#/types'
import Loader from '#/components/Loader'
import { LogoPreview } from '#/components/AdminTools/Account/LogoUpload'
import Pagination from '#/components/Pagination'
import Table from '#/components/Table/Table'
import TableFilter from '#/components/Table/TableFilter'
import { connect } from 'react-redux'

const tableStyles = require('#/components/Table/styles.scss')
const styles = require('#/components/AdminTools/styles.scss')

type Props = OwnProps & ActionProps & StateProps

class PracticeTable extends React.Component<Props, State> {
  state: State = {
    showSearch: true,
    showPagination: true,
    basicSearchQuery: '',
    isSearching: false,
    searchQuery: '',
    order: 'ASC' as Api.SortOrder,
    sort: 'name'
  }

  get group () {
    if (!this.isPracticeAdmin) {
      return this.props.group
    }

    // if they are not a group admin, get the parent group info from one of the practices
    return this.practices[0] && this.practices[0].parent_group
  }

  get isPracticeAdmin () {
    const { loggedInUser } = this.props
    const dentistryGroup = loggedInUser.groups && loggedInUser.groups.find((group) => group.group_type.code === 'dentistry')

    // a practice admin will not have dentistryGroups
    if (isSuperUser(loggedInUser) || dentistryGroup) {
      return false
    }

    return true
  }

  loadPage = (page: number = 1) => {
    const { groupId, searchPractices } = this.props
    const { searchQuery, order, sort } = this.state

    if (!this.isPracticeAdmin) {
      this.props.getGroup({ id: groupId, useLambda: true })
    }

    searchPractices({
      parentGroupId: groupId,
      searchQuery,
      sort,
      order,
      page,
      perPage: 10
    })
  }

  search = ({ query }) => {
    if (query && query.length > 2) {
      this.setState({ searchQuery: query }, this.loadPage)
    } else {
      this.setState({ searchQuery: '' }, this.loadPage)
    }
  }

  renderLoading = () => (
    <Loader size={30}/>
  )

  handleRowClick = (row: any) => {
    this.props.history.push(`/admin-tools/manage-practices/edit-practice/${row.id}`)
  }

  get practices () {
    return (this.state.isSearching)
      ? []
      : this.props.practiceState.data
  }

  get pages () {
    return (this.props.practiceState.perPage)
      ? Math.ceil(this.props.practiceState.count / this.props.practiceState.perPage)
      : 1
  }

  get currentPage () {
    return this.props.practiceState.currentPage || 0
  }

  componentDidMount () {
    this.loadPage(1)
  }

  private renderLogo = (_: any, row: any) => {
    const { id, group_logo } = row

    if (!group_logo) {
      return null
    }
    return <LogoPreview forTable src={getLambdaGroupLogoSrc(id)} />
  }

  renderActiveAccounts = (_: any, row: any) => {
    const { accounts } = row

    const nonPatientAccounts = accounts && accounts.filter((account) => account.is_patient !== true)

    return <div>{ nonPatientAccounts && nonPatientAccounts.length }</div>
  }

  sortBy = (direction: Direction) => (sort: string) => {
    this.setState({
      sort: sort,
      order: direction
    }, () => {
      this.loadPage(this.currentPage)
    })
  }

  render () {
    const group = this.group
    return (
      <>
        <div className={styles.tableHeader}>
          {
            group &&
            <AccountEditPreview
              group={group}
              showLink={!this.isPracticeAdmin}
            />
          }
          {
            this.props.showSearch &&
            <TableFilter
              defaultFilterValue='all'
              onSearchCb={this.search}
              placeholderText='Search Practices'
            />
          }
        </div>
        <Table
          name='practices'
          data={this.practices}
          className={tableStyles.practicesTable}
          defaultSortByAccessor='name'
          fetching={this.props.practiceState.fetching}
          columns={[
            {
              name: '',
              accessor: 'logo',
              renderCell: this.renderLogo
            },
            {
              name: 'Name',
              accessor: 'name',
              sortBy: (sort) => this.sortBy(sort)('name')
            },
            {
              name: 'Active Users',
              accessor: 'num_active_accounts'
            }
          ]}
          actionColumnName={' '}
          actionColumn={
            (row) => <div><Link className={styles.actionLink} to={`/admin-tools/manage-practices/edit-practice/${row.id}`}>Edit</Link></div>
          }
          onRowClick={this.handleRowClick}
        />
        {this.props.showPagination && <Pagination pages={this.pages} currentPage={this.currentPage} handleClick={this.loadPage} />}
      </>
    )
  }
}

export default withRouter(connect<StateProps, ActionProps, OwnProps, AppState>(
  (state: AppState, props) => ({
    loggedInUser: state.auth.data.account,
    group: GroupActions.selectors.getById(state, props.match.params.groupId),
    practiceState: state.practices
  }),
  {
    getGroup: GroupActions.GetGroupById,
    searchPractices: AdminToolsSearchPractices
  }
)(PracticeTable))
