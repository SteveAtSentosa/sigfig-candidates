import * as Api from '#/api'
import * as React from 'react'

import { Account, AccountLookup, EntityId } from '#/types'
import { GetAccountsForPracticeEdit, UpdateAccount } from '#/actions/accounts'
import { debounce, isEmpty } from 'lodash'

import { AppState } from '#/redux'
import Input from '#/components/Input'
import { Link } from 'react-router-dom'
import Loader from '#/components/Loader'
import PopperWorkspace from '#/components/PopperWorkspace'
import { QuickAddSearch as QuickAddSearchType } from '#/reducers/accounts'
import { connect } from 'react-redux'

const styles = require('./styles.scss')
const adminToolsStyles = require('#/components/AdminTools/styles.scss')

interface OwnProps {
  groupId: EntityId
  practiceId?: EntityId
  addAccount: (account: Account) => void
}

interface StateProps {
  accounts: AccountLookup
  quickAddSearch: QuickAddSearchType
}

interface ActionProps {
  updateAccount: typeof UpdateAccount
  getAccounts: typeof GetAccountsForPracticeEdit
}

class QuickAddSearch extends React.Component<OwnProps & StateProps & ActionProps> {
  quickAddSearchRef = React.createRef<HTMLInputElement>()
  popperListRef = React.createRef<typeof PopperWorkspace>()

  hidePopper = (ref) => {
    ref.current.hide()
  }

  openPopper = (ref) => {
    ref.current.show()
  }

  search = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { practiceId, groupId } = this.props
    const { value } = e.target
    if (value && value.length > 2) {
      this.openPopper(this.popperListRef)
      this.props.getAccounts({ practiceId, parentGroupId: groupId, params: this.getParamsForQuery(value) })
    } else {
      this.hidePopper(this.popperListRef)
    }
  }

  getParamsForQuery = (query: string): Api.AccountLambdaQueryOpts => {
    if (query === '') {
      return undefined
    }
    return {
      full_name: query,
      email: query
    }
  }

  debounceSearch = debounce(this.search, 500)

  addToAccount = (account: Account) => {
    this.hidePopper(this.popperListRef)
    return this.props.addAccount(account)
  }

  private get accounts (): Account[] {
    const { accounts, quickAddSearch } = this.props
    return quickAddSearch && quickAddSearch.results.map(result => accounts[result])
  }

  renderAccounts = () => {
    const { quickAddSearch } = this.props

    if (quickAddSearch && quickAddSearch.fetching) {
      return <Loader/>
    } else {
      if (isEmpty(this.accounts)) {
        return <div className={styles.noResults}>No results...</div>
      }

      return this.accounts.map((account: Account, i: number) => {
        return <div onClick={() => this.addToAccount(account)} key={i} className={styles.searchItem}>{account.first_name} {account.last_name}</div>
      })
    }
  }

  render () {
    return (
      <div className={styles.quickAddProvider}>
        <div className={styles.quickAddProviderLabel}>Quick Add Provider:</div>
          <div className={styles.quickAddInput}>
            <Input
              onChange={this.debounceSearch}
              placeholder='Start typing name...'
              containerRef={this.quickAddSearchRef}
            />
          </div>
        <div className={styles.quickAddCopy}>or <Link className={adminToolsStyles.actionLink} to={'/admin-tools/manage-accounts/create-account/'} target='_blank'>create new</Link> provider account.</div>
        <PopperWorkspace
          flexWidth offset={'0,1vh'}
          targetRef={this.quickAddSearchRef}
          ref={this.popperListRef}
        >
          <div className={styles.searchResults}>
            <div className={styles.section}>
              {this.renderAccounts()}
            </div>
          </div>
        </PopperWorkspace>
      </div>
    )
  }
}

export default connect<StateProps, ActionProps, OwnProps, AppState>(
  (state: AppState) => ({
    accounts: state.accounts.accounts,
    quickAddSearch: state.accounts.quickAddSearch
  }),
  {
    updateAccount: UpdateAccount,
    getAccounts: GetAccountsForPracticeEdit
  }
)(QuickAddSearch)
