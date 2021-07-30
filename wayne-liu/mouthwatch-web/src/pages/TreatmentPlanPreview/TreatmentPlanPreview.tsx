import * as React from 'react'
import { AppState } from '#/redux'
import Page from '#/components/Page'
import { connect } from 'react-redux'
import { matchPath } from 'react-router'
import Container from '#/components/Container'
import { TreatmentPlanEntity } from '#/api/types'
import { RouteProps } from '#/types'
import { LoadTreatmentPlan } from '#/actions/treatmentPlans'
import TreatmentPlan from '#/components/TreatmentPlan'
const styles = require('./styles.scss')

interface OwnProps {
  treatmentPlanId: string
}

interface StateProps {
  /*
    treatmentPlan is the treatment plan record returned from service
    treatmentPlanDraft is the draft of that treatment plan (i.e. if the user is previewing a work-in-progress of the treatment plan)
  */
  treatmentPlan: TreatmentPlanEntity
  treatmentPlanDraft: TreatmentPlanEntity
}

interface ActionProps {
  loadTreatmentPlan: typeof LoadTreatmentPlan
}

type Props = ActionProps & OwnProps & StateProps & RouteProps

class TreatmentPlanPreview extends React.PureComponent<Props> {

  load = () => {
    const { params: { treatmentPlanId } } = matchPath<OwnProps>(
      this.props.location.pathname,
      {
        path: '/treatmentPlanPreview/:treatmentPlanId',
        exact: false,
        strict: false
      }
    )

    this.props.loadTreatmentPlan({
      treatmentPlanId: treatmentPlanId,
      associations: [
       { model: 'patient', associations: [{ model: 'media' }] },
       { model: 'procedure', associations: [{ model: 'account', as: 'provider' }] },
       { model: 'media', associations: [{ model: 'note', associations: [{ model: 'account', as: 'createdBy' }] }] }
      ]
    })
  }

  get patient () {
    const { treatmentPlan } = this.props
    return treatmentPlan && treatmentPlan.patient
  }

  componentDidMount () {
    this.load()
  }

  render () {
    const { treatmentPlan, treatmentPlanDraft } = this.props

    return (
      <Page title='Treatment Plan Preview'>
        <Container grow fullWidth>
          <div className={styles.treatment_plan_preview}>
            {
              treatmentPlan && treatmentPlanDraft.id &&
              <TreatmentPlan viewOnly treatmentPlan={treatmentPlanDraft} patient={this.patient} />
            }
          </div>
        </Container>
      </Page>
    )
  }
}

export default connect<StateProps, ActionProps, OwnProps, AppState>(
  (state: AppState) => ({
    treatmentPlan: state.treatmentPlans.treatmentPlan,
    treatmentPlanDraft: state.treatmentPlans.draft
  }),
  {
    loadTreatmentPlan: LoadTreatmentPlan
  }
)(TreatmentPlanPreview)
