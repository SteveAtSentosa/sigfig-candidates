import * as React from 'react'
import { Patient } from '#/types'
import { TreatmentPlanEntity } from '#/api/types'
import { DraggableSection, ContainerViewOnly, SectionComponent } from '#/pages/Patients/TreatmentPlanBuilder/Section'

interface Props {
  viewOnly?: boolean
  treatmentPlan: TreatmentPlanEntity
  patient: Patient
  exporting?: boolean
}

export default class TreatmentPlan extends React.PureComponent<Props> {

  get isViewOnly () {
    const { viewOnly, exporting } = this.props
    return viewOnly || exporting
  }

  renderEditable = () => {
    const { patient, treatmentPlan: { layout: { sections } } } = this.props
    return sections.map((section, k) => {
      return (
        <DraggableSection
          sectionId={section.id}
          type={section.type}
          key={k}
          index={k}
          exporting={this.isViewOnly}
          patient={patient}/>
      )
    })
  }

  renderViewOnly = () => {
    const { treatmentPlan: { data } } = this.props
    return data.map((sectionData, k) => {
      const { patient } = this.props
      const { section_id: sectionId, section_type: type } = sectionData

      return (
        <ContainerViewOnly
          key={k}
          defaultValue={sectionData.title}
          hideSectionTitle={false}
          sectionId={sectionId}
          sectionType={type}>
          <SectionComponent
            type={type}
            patient={patient}
            sectionId={sectionId}
            isDragging={false}
            exporting
          />
        </ContainerViewOnly>
      )
    })
  }

  render () {
    const { viewOnly } = this.props
    return viewOnly ? this.renderViewOnly() : this.renderEditable()
  }
}
