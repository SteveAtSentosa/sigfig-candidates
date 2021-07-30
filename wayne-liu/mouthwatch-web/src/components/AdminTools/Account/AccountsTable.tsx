import * as Api from '#/api'
import * as React from 'react'

import { ActionProps, OwnProps, State, StateProps } from './types'

import { AdminToolsSearchGroups } from '#/actions/groups'
import { AppState } from '#/redux'
import { Direction } from '#/types'
import Loader from '#/components/Loader'
import { LogoPreview } from '#/components/AdminTools/Account/LogoUpload'
import Pagination from '#/components/Pagination'
import Table from '#/components/Table/Table'
import TableFilter from '#/components/Table/TableFilter'
import { connect } from 'react-redux'
import { getLambdaGroupLogoSrc } from '#/utils/CheckMediaType'
import { withRouter } from 'react-router-dom'

const styles = require('#/components/Table/styles.scss')

type Props = OwnProps & ActionProps & StateProps

class AccountsTable extends React.Component<Props, State> {
  state: State = {
    showSearch: true,
    showPagination: true,
    basicSearchQuery: '',
    isSearching: false,
    searchQuery: '',
    order: 'ASC' as Api.SortOrder,
    sort: 'name'
  }

  get currentPage () {
    return this.props.groupState.currentPage || 0
  }

  componentDidMount () {
    this.loadPage(1)
  }

  loadPage = (page: number = 1) => {
    const { order, sort, searchQuery } = this.state

    this.props.searchGroups({
      searchQuery,
      order,
      sort,
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

  get groups () {
    return (this.state.isSearching)
      ? []
      : this.props.groupState.data
  }

  get pages () {
    return (this.props.groupState.perPage)
      ? Math.ceil(this.props.groupState.count / this.props.groupState.perPage)
      : 1
  }

  handleRowClick = (row: any) => {
    this.props.history.push(`/admin-tools/manage-practices/${row.id}`)
  }

  renderGroupLogo = (_: any, row: any) => {
    const { group_logo, id } = row
    if (!group_logo) {
      return null
    }
    return <LogoPreview forTable src={getLambdaGroupLogoSrc(id)} />
  }

  sortBy = (order: Direction) => (sort: string) => {
    this.setState({
      sort,
      order
    }, () => {
      this.loadPage(this.currentPage)
    })
  }

  onClick = (event: React.MouseEvent, row) => {
    this.props.history.push(`/admin-tools/manage-groups/edit-group/${row.id}`)
    event.stopPropagation()
  }

  renderActiveAccounts = (group_license) => {
    return group_license ? group_license.licenses_used : null
  }

  private renderPractices = (_: any, row: any) => {
    const groupId = row.id
    const { childGroups } = this.props.groupState
    const reducedList = childGroups.byParentId && childGroups.byParentId[groupId] && childGroups.byParentId[groupId].reduce((acc, v) => {
      acc.push(v.name)
      return acc
    }, [])

    return (
      <div>{reducedList && reducedList.join(', ')}</div>
    )
  }

  render () {
    const { groupState } = this.props
    return (
      <div>
        {
          this.props.showSearch &&
          <TableFilter
            onSearchCb={this.search}
            defaultFilterValue='all'
            placeholderText='Search Accounts'
          />
        }
        <Table
          name='groups'
          data={this.groups}
          defaultSortByAccessor='name'
          className={styles.groupsTable}
          fetching={groupState.fetching}
          columns={[
            {
              name: '',
              accessor: 'logo',
              renderCell: this.renderGroupLogo
            },
            {
              name: 'Name',
              accessor: 'name',
              sortBy: (sort) => this.sortBy(sort)('name')
            },
            {
              name: 'Practices',
              accessor: 'id',
              renderCell: this.renderPractices
            },
            {
              name: 'Users',
              accessor: 'group_license',
              renderCell: this.renderActiveAccounts
            }
          ]}
          actionColumnName={' '}
          actionColumn={
            (row) => <div><a href='#' onClick={(e) => this.onClick(e, row)}>Edit</a></div>
          }
          onRowClick={this.handleRowClick}
        />
        {this.props.showPagination && <Pagination pages={this.pages} currentPage={this.currentPage} handleClick={this.loadPage} />}
      </div>
    )
  }
}

export default withRouter(connect<StateProps, ActionProps, OwnProps, AppState>(
  (state) => ({
    groupState: state.groups
  }),
  {
    searchGroups: AdminToolsSearchGroups
  }
)(AccountsTable))
