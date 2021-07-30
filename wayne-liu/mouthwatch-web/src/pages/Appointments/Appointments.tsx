import * as React from 'react'

import AppointmentsContainer from './AppointmentsContainer'
import Container from '#/components/Container'
import Page from '#/components/Page'
import { Pane } from './AppointmentDetail'
import { RouteProps } from '#/types'
import { withFooterActionBar } from '#/components/FooterActionBar'

const styles = require('./styles.scss')

interface Props extends RouteProps {
  pane: Pane
}

/**
 * Appointments page
 */
@withFooterActionBar()
export default class AppointmentsPage extends React.Component<Props> {
  render () {
    return (
      <Page title='Appointments'>
        <Container className={styles.appointments}>
          <AppointmentsContainer />
        </Container>
      </Page>
    )
  }
}
