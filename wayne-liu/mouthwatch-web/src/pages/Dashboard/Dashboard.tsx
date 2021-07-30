import * as React from 'react'

import { Column, Grid } from '#/components/BSGrid'

import Container from '#/components/Container'
import DropdownFilter from './Tasks/DropdownFilter'
import EssentialTaskWidget from '#/components/Essential/EssentialTaskWidget'
import NewAppointmentButton from './UpcomingAppointments/NewAppointmentButton'
import Page from '#/components/Page'
import QuickActionsWidget from './QuickActions/QuickActionsWidget'
import TasksWidget from './Tasks/TasksWidget'
import UpcomingAppointmentsWidget from './UpcomingAppointments/UpcomingAppointmentsWidget'
import WidgetContainer from './WidgetContainer'
import { withFooterActionBar } from '#/components/FooterActionBar'
import EssentialBanner from '#/components/Essential/EssentialBanner/EssentialBanner'
import { Props } from './types'
import { hasPermission } from '#/utils'

const styles = require('./styles.scss')

/**
 * Dashboard page
 */
@withFooterActionBar()
export default class DashboardPage extends React.PureComponent<Props> {

  render () {
    const { viewPerms } = this.props
    return (
      <Page title='Dashboard' className={styles.dashboardPage}>
        <Container fullWidth className='dashboard_wrapper'>
          <div className={styles.dashboard}>

            <Grid>
              {!viewPerms && (
                <Column col={12} className={styles.essentialBanner}>
                  <EssentialBanner />
                </Column>
              )}

              <Column col={12} md={6}>
                <WidgetContainer>
                  {{
                    title: 'Create',
                    className: 'quick-actions',
                    widget: <QuickActionsWidget viewPerms={viewPerms} />
                  }}
                </WidgetContainer>
                <WidgetContainer>
                  {{
                    title: 'Appointments',
                    className: 'upcoming-appts',
                    submenu: <NewAppointmentButton />,
                    widget: <UpcomingAppointmentsWidget />
                  }}
                </WidgetContainer>
              </Column>
              <Column col={12} md={6}>
                {hasPermission(viewPerms, 'tasks')
                  ? <WidgetContainer>
                      {{
                        title: 'Tasks',
                        className: 'tasks',
                        submenu: <DropdownFilter />,
                        widget:  <TasksWidget />
                      }}
                    </WidgetContainer>
                  : <EssentialTaskWidget />}
              </Column>

            </Grid>

          </div>
        </Container>
      </Page>
    )
  }
}
