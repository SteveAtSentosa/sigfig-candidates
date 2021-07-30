import * as Api from '#/api'
import * as React from 'react'

import { Direction, EntityId, PracticeLocation } from '#/types'
import { Link, RouteComponentProps, withRouter } from 'react-router-dom'

import EssentialTooltip from '#/components/EssentialTooltip'
import { LoadLocationList } from '#/actions/locations'
import Table from '#/components/Table/Table'

const styles = require('#/components/AdminTools/styles.scss')
const tableStyles = require('#/components/Table/styles.scss')

interface OwnProps extends RouteComponentProps {
  fetching: boolean
  practiceId: EntityId
  showUpgradeTooltip?: boolean
  locations: PracticeLocation[]
  getLocations: typeof LoadLocationList
}

interface State {
  order: string
  sort: Api.SortOrder
}

class LocationsTable extends React.Component<OwnProps, State> {
  state: State = {
    order: 'name',
    sort: 'ASC' as Api.SortOrder
  }

  loadPage = () => {
    const { practiceId } = this.props
    const { order, sort } = this.state

    const where: Api.WhereValue[] = [
      { and: [{ prop: 'group_id', comp: '=', param: practiceId }] }
    ]

    this.props.getLocations({
      withAppointmentCount: true,
      order,
      sort,
      where: where
    })
  }

  componentDidMount () {
    if (!this.props.showUpgradeTooltip) {
      this.loadPage()
    }
  }

  sortBy = (direction: Direction) => (order: string) => {
    this.setState({ sort: direction, order: order }, this.loadPage)
  }

  private get columns () {
    return(
      [
        {
          name: 'Name',
          accessor: 'name',
          sortBy: (sort) => this.sortBy(sort)('name')
        },
        {
          name: 'Address',
          accessor: 'address1',
          sortBy: (sort) => this.sortBy(sort)('address1'),
          renderCell: (address, location) => {
            if (location) {
              const { city, state } = location
              const cityAndState = state ? city + ', ' + state : city
              return (
                <span>{address} {cityAndState} </span>
              )
            }
          }
        },
        {
          name: 'Appointments',
          accessor: 'appointmentsCount'
        }
      ]
    )
  }

  private get locations () {
    const { locations, showUpgradeTooltip } = this.props
    return !showUpgradeTooltip ? locations : []
  }

  private reRoute = (locationId: EntityId) => {
    return () => {
      this.props.history.push(`/admin-tools/edit-location/${locationId}`)
    }
  }

  private handleRowClick = (row: PracticeLocation) => {
    this.props.history.push(`/admin-tools/edit-location/${row.id}`)
  }

  private renderLink = () => {
    const { practiceId, showUpgradeTooltip } = this.props
    return (
      <>
        {
          !showUpgradeTooltip ?
          <>
            <Link className={styles.actionLink} to={`/admin-tools/create-location?practiceId=${practiceId}`}>Create a new</Link>&nbsp;location for this practice.
          </> :
          <EssentialTooltip
            content={<span>Improve your practice management by <strong>adding locations</strong>. Assign providers and appointments directly to their relevant offices for better tracking.</span>}
            >
              <Link to='#'>Create a new location for this practice.</Link>
          </EssentialTooltip>
        }
      </>
    )
  }

  render () {
    const { fetching } = this.props

    return (
      <div className={styles.bottomSpacing}>
        <h5 className={styles.sectionTitle}>Locations</h5>
        <div className={styles.sectionDetails}>
          <div className={styles.row}>
            { this.renderLink() }
          </div>
          <div className={styles.row}>
            <Table
              name='locations'
              defaultSortByAccessor='name'
              data={this.locations}
              className={tableStyles.practiceLocationsTable}
              fetching={fetching}
              columns={this.columns}
              actionColumnName={' '}
              actionColumn={
                (row) => {
                  return (
                    <a className={styles.actionLink} onClick={this.reRoute(row.id)}>Edit</a>
                  )
                }
              }
              onRowClick={this.handleRowClick}
            />
          </div>
        </div>
      </div>
    )
  }
}

export default withRouter(LocationsTable)
