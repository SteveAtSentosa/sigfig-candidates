import * as React from 'react'

import { AppState } from '#/redux'
import FilterModal from '#/components/Modal/FilterModal'
import { FilterObject } from '#/actions/types'
import MaterialIcon from '#/components/Icon'
import { connect } from 'react-redux'
import { omit } from 'lodash'

const styles = require('./manage.scss')

interface Props {
  handleSubmit: (values: object) => void
}
interface StateProps {
  filters: FilterObject
  dataIds: string[]
}
interface State {
  filterModalIsOpen?: boolean
}

class FilterButton extends React.Component<Props & StateProps, State> {
  state: State = {
    filterModalIsOpen: false
  }

  private openModal = () => this.setState({ filterModalIsOpen: true })
  private closeModal = () => this.setState({ filterModalIsOpen: false })

  private handleSubmit = (values: object) => {
    this.props.handleSubmit(values)
    this.closeModal()
  }

  private get numFilters () {
    return Object.keys(omit(this.props.filters, ['start_date', 'end_date'])).length
  }

  private get numResults () {
    const { dataIds } = this.props
    return (dataIds && dataIds.length) || 0
  }

  render () {
    return (
      <div>
        <div className={styles.filterButton} onClick={this.openModal}>
          <MaterialIcon name='filter_list' />
          <span className={styles.title}>
            Filter task list
          </span>
          <span className={styles.filters}>
            {`${this.numFilters} ${this.numFilters === 1 ? 'filter' : 'filters' }`}
          </span>
          <span className={styles.results}>
            {`${this.numResults} ${this.numResults === 1 ? 'result' : 'results'}`}
          </span>
        </div>

        <FilterModal
          isOpen={this.state.filterModalIsOpen}
          close={this.closeModal}
          handleSubmitFilters={this.handleSubmit}
        />
      </div>

    )
  }
}

export default connect<StateProps, {}, Props, AppState>(
  (state: AppState) => ({
    filters: state.tasks.list.filters,
    dataIds: state.tasks.list.dataIds
  })
)(FilterButton)
