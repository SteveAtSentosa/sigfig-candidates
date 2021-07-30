import * as Api from '#/api'
import * as React from 'react'

import { State as AccountState } from '#/reducers/accounts'
import { AppState } from '#/redux'
import { GetAccounts } from '#/actions/accounts'
import MaterialIcon from '#/components/Icon'
import SearchAppointmentModal from './SearchAppointmentModal'
import { SearchFilters } from '#/reducers/appointments'
import { connect } from 'react-redux'

const styles = require('./styles.scss')

interface Props {
  handleSearch?: (values: object) => void
  searchFilters?: SearchFilters
}

interface ActionProps {
  getAccounts: typeof GetAccounts
}

interface StateProps {
  count: number
  accountState: AccountState
  loggedInUser: Api.LoginResponseAccount
}

interface State {
  modalIsOpen?: boolean
}

class FilterButton extends React.Component<Props & StateProps & ActionProps, State> {
  state = {
    modalIsOpen: false
  }

  openModal = () => this.setState({ modalIsOpen: true })
  closeModal = () => this.setState({ modalIsOpen: false })

  handleSearch = (values: object) => {
    this.props.handleSearch(values)
    this.closeModal()
  }

  get numResults () {
    return this.props.count || 0
  }

  private loadProvidersOfGroup = () => {
    this.props.getAccounts({
      isLambda: true,
      page: 1,
      perPage: 50,
      is_patient: false,
      inactive: false
    })
  }

  componentDidMount () {
    this.loadProvidersOfGroup()
  }

  render () {
    const { accountState, loggedInUser } = this.props

    return (
      <div>
        <div className={styles.filterButton} onClick={this.openModal}>
          <MaterialIcon name='filter_list' />
          <span className={styles.title}>
            Filter ({Object.keys(this.props.searchFilters).length})
          </span>
          <span className={styles.results}>
            {`${this.numResults ? this.numResults : 0} ${this.numResults === 1 ? 'result' : 'results'}`}
          </span>
        </div>

        <SearchAppointmentModal
          isOpen={this.state.modalIsOpen}
          close={this.closeModal}
          handleSearch={this.handleSearch}
          searchFilters={this.props.searchFilters}
          providers={accountState.accounts}
          selectedProviderId={loggedInUser.id}
        />
      </div>
    )
  }
}

export default connect<StateProps, ActionProps, Props, AppState>(
  (state: AppState) => ({
    count: state.appointments.count,
    accountState: state.accounts,
    loggedInUser: state.auth.data.account
  }),
  {
    getAccounts: GetAccounts
  }
)(FilterButton)
