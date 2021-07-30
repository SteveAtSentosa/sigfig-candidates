import * as Api from '#/api'
import * as React from 'react'

import { Account, Direction } from '#/types'
import { ActionProps, OwnProps, State, StateProps } from './types'
import { rolesFilterMap, userRolesMap } from '#/consts'

import { Link } from 'react-router-dom'
import Pagination from '#/components/Pagination'
import Table from '#/components/Table/Table'
import TableFilter from '#/components/Table/TableFilter'
import ToggleInput from '#/components/Form/Toggle'
import { isSuperUser } from '#/utils'

const tableStyles = require('#/components/Table/styles.scss')
const styles = require('#/components/AdminTools/styles.scss')

export default class UsersTable extends React.Component<ActionProps & StateProps & OwnProps, State> {
  state: State = {
    basicSearchQuery: '',
    order: 'ASC' as Api.SortOrder,
    sort: 'email',
    showInactiveAccounts: false,
    accountRoles: undefined
  }

  private loadPage = (page: number = 1) => {
    const { accountRoles, order, sort, showInactiveAccounts } = this.state

    this.props.searchAccounts({
      accountRoles,
      order,
      sort,
      page,
      per_page: 10,
      inactive: showInactiveAccounts,
      is_patient: false,
      ...this.searchQueryParams
    })
  }

  private search = ({ query }) => {
    if (query && query.length > 3) {
      this.setState({ basicSearchQuery: query }, this.loadPage)
    } else {
      this.setState({ basicSearchQuery: ' ' }, this.loadPage)
    }
  }

  private get searchQueryParams (): Api.AccountLambdaQueryOpts {
    const { basicSearchQuery: query } = this.state
    if (query === '') {
      return null
    }

    return {
      full_name: query,
      email: query
    }
  }

  private filterByRole = (role: string) => {
    if (role === 'all') {
      this.setState({ accountRoles: undefined }, this.loadPage)
      return
    }
    this.setState({ accountRoles: rolesFilterMap[role] }, this.loadPage)
  }

  private get accounts (): Account[] {
    const { accountState: { accounts, search } } = this.props
    return (search && !search.fetching)
      ? search.results.map(result => accounts[result])
      : []
  }

  private get fetching () {
    const { accountState: { search } } = this.props

    return search && search.fetching
  }

  get pages () {
    const { accountState: { meta } } = this.props
    return (meta.perPage)
      ? Math.ceil(meta.count / meta.perPage)
      : 1
  }

  get currentPage () {
    const { accountState: { meta } } = this.props
    return meta.currentPage || 0
  }

  private handleRowClick = (row: Account | Api.LoginResponseAccount) => {
    // if they're a super user (and you're the super user, you should be), route to my-account
    if (row.id === this.props.authedAccount.id && isSuperUser(row)) {
      return this.props.history.push('/my-account')
    }
    this.props.history.push(`/admin-tools/manage-users/edit-user/${row.id}`)
  }

  private sortBy = (order: Direction) => (sort: string) => {
    this.setState({ sort, order }, () => {
      this.loadPage(this.currentPage)
    })
  }

  private setShowInactive = (_e: React.ChangeEvent<HTMLInputElement>) => {
    const { showInactiveAccounts } = this.state
    this.setState({ showInactiveAccounts: !showInactiveAccounts }, this.loadPage)
  }

  componentDidMount () {
    this.loadPage()
  }

  getDisabledClassname = (account) => {
    if (account.status === 'inactive') {
      return styles.disabledRow
    }
    return ''
  }

  render () {
    return (
      <div>
        {
          this.props.showSearch &&
          <TableFilter
            defaultFilterValue=' '
            onSearchCb={this.search}
            filterByRole={this.filterByRole}
            placeholderText='Search Users'
          />
        }
        <Table
          name='accounts'
          defaultSortByAccessor='email'
          className={tableStyles.accountsTable}
          data={this.accounts}
          fetching={this.fetching}
          rowClassnameConditional={this.getDisabledClassname}
          columns={[
            {
              name: 'Email',
              accessor: 'email',
              sortBy: (order) => this.sortBy(order)('email')
            },
            {
              name: 'First Name',
              accessor: 'first_name',
              sortBy: (order) => this.sortBy(order)('first_name')
            },
            {
              name: 'Last Name',
              accessor: 'last_name',
              sortBy: (order) => this.sortBy(order)('last_name')
            },
            {
              name: 'Role',
              accessor: 'account_roles',
              renderCell: (roleList) => {
                const reducedList = roleList.reduce((acc, v) => {
                  return acc.concat(userRolesMap[v])
                }, [])
                return (
                  <div>{reducedList.join(reducedList.length > 1 ? ', ' : '')}</div>
                )
              }
            },
            {
              name: 'Practices',
              accessor: 'practices',
              renderCell: (practices) => {
                const names = practices && practices.map(g => g.name)
                return (
                  <div>{names && names.join(', ')}</div>
                )
              }
            }
          ]}
          actionColumnName={' '}
          actionColumn={
            () => {
              return (
                <Link className={styles.actionLink} to=''>Edit</Link>
              )
            }
          }
          onRowClick={this.handleRowClick}
        />
        <div className={styles.row}>
          <div className={styles.showInactiveAccounts}>
            <ToggleInput
              name='showInactiveAccounts'
              onChange={this.setShowInactive}
              text='Show deactivated users:'
            />
          </div>
          <div className={styles.pagination}>
            {
              this.props.showPagination &&
              <Pagination pages={this.pages} currentPage={this.currentPage} handleClick={this.loadPage}/>
            }
          </div>
        </div>
      </div>
    )
  }
}
