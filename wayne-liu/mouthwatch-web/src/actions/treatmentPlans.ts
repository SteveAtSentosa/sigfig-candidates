import * as Api from '#/api'
import * as React from 'react'

import { EntityId, LayoutSection, MediaDictionary, SectionData, SectionTypes } from '#/types'
import { createDeepEqualSelector, createSelectors } from './common'

import { AppState } from '#/redux'
import { ParametricSelector } from 'reselect'
import { defineAction } from 'redoodle'

// Selectors

export const treatmentPlanDraftSelector = (state: AppState) => state.treatmentPlans.draft
export const treatmentPlanSectionsSelector = (state: AppState) => state.treatmentPlans.draft.layout.sections
export const treatmentPlanDataSelector = (state: AppState) => state.treatmentPlans.draft.data
export const sectionDataByIdSelector = (draftData: SectionData[], sectionId: string) => draftData.find(data => data.section_id === sectionId)

export const sectionIdSelector: ParametricSelector<AppState, string, string> = (_state, sectionId) => sectionId
export const sectionDataByIdDeepEqualSelector = createDeepEqualSelector(treatmentPlanDataSelector, sectionIdSelector, sectionDataByIdSelector)

export const sectionLayoutByIdSelector = (state: AppState, sectionId: string) => state.treatmentPlans.draft.layout.sections.find(section => section.id === sectionId)

type CreateTreatmentPlanPayload = { after?: (id: string, patientId: string) => void }

type SaveTreatmentPlanPayload = {
  patientId: EntityId
  after?: (id: string) => void
}

// Actions
export const SetBlankTreatmentPlan = defineAction('[treatment-plan] create blank treatment plan')()

// These operate on the Treatment Plan draft in store
// Type definitions for value are handled in the individual components
export const UpdateDraft = defineAction('[treatment-plan] update current draft')<{ attribute: string, value: any }>()
export const UpdateLayout = defineAction('[treatment-plan] update layout')<{ sections: LayoutSection[] }>()
export const UpdateData = defineAction('[treatment-plan] update data')<{
  sectionId: string
  sectionType: SectionTypes
  values: {
    title?: string
    text?: string
    procedures?: EntityId[]
    media?: MediaDictionary
    order?: EntityId[]
    columns?: number
    visible_details?: string[]
    logo_url?: string
  }
}>()
export const RemoveData = defineAction('[treatment-plan] remove data')<{ sectionId: string }>()

export const AddSection = defineAction('[treatment-plan builder] add section')<{ sectionId: string, type: SectionTypes, sectionIdAbove?: string }>()
export const RemoveSection = defineAction('[treatment-plan builder] remove section')<{ sectionId: string }>()
export const DuplicateSection = defineAction('[treatment-plan builder] duplicate section')<{ sectionId: string }>()

export const SetCurrentDraft = defineAction('[treatment-plan] set current draft')<{ record: Api.TreatmentPlanEntity }>()

// This action sends the PUT request
export const SaveCurrentPlan = defineAction('[treatment-plan] put treatment plan')<SaveTreatmentPlanPayload>()
export const SaveCurrentPlanSuccess = defineAction('[treatment-plan] put treatment plan success')()
export const SaveCurrentPlanError = defineAction('[treatment-plan] put treatment plan error')<{ error: Error }>()

export const FinalizeTreatmentPlan = defineAction('[treatment-plan] finalize treatment plan')<{ file: Blob, treatmentPlanId: EntityId, updated_at: string }>()
export const FinalizeTreatmentPlanSuccess = defineAction('[treatment-plan] finalize treatment plan success')()
export const FinalizeTreatmentPlanError = defineAction('[treatment-plan] finalize treatment plan error')()

export const PatchTreatmentPlan = defineAction('[treatment-plan] patch treatment plan')<{ treatmentPlanId: EntityId, patchedEntity: Api.PatchedEntity, updated_at: string }>()

export const LoadTreatmentPlan = defineAction('[treatment-plan] load treatment plan')<{ treatmentPlanId: EntityId, associations?: Api.AssociationValue, withMediaMetadata?: boolean }>()
export const LoadTreatmentPlanSuccess = defineAction('[treatment-plan] load treatment plan sucess')<{ treatmentPlan: Api.TreatmentPlanEntity }>()
export const LoadTreatmentPlanError = defineAction('[treatment-plan] load treatment plan error')<{ error: Error }>()

export const LoadList = defineAction('[treatment-plan] load list')<{ where: Api.WhereValue[], associations?: Api.AssociationValue, selected?: EntityId, order?: string, sort?: Api.SortOrder, orderAs?: string }>()
export const LoadListSuccess = defineAction('[treatment-plan] load list success')<{ data: Api.TreatmentPlanEntity[], selected?: EntityId }>()
export const LoadListError = defineAction('[treatment-plan] load list error')<{ error: Error }>()

export const GetPatientTreatmentPlans = defineAction('[treatment-plan] get patient treatment plans')<{ patientId: EntityId }>()

export const CreateTreatmentPlan = defineAction('[treatment-plan] create treatment plan')<CreateTreatmentPlanPayload>()
export const CreateTreatmentPlanSuccess = defineAction('[treatment-plan] create treatment plan success')()
export const CreateTreatmentPlanError = defineAction('[treatment-plan] create treatment plan error')<{ error: Error }>()

export const DeleteTreatmentPlan = defineAction('[treatment-plan] delete treatment plan')<{ patientId: EntityId, treatmentPlanId: EntityId }>()

export const PrintTreatmentPlanStart = defineAction('[treatment-plan] print treatment plan start')<{ treatmentPlanRef: React.RefObject<HTMLDivElement> }>()
export const PrintTreatmentPlanEnd = defineAction('[treatment-plan] print treatment plan end')()

export const OpenSendTreatmentPlan = defineAction('[treatment] open send treatment plan')()
export const CloseSendTreatmentPlan = defineAction('[treatment] close send treatment plan')()

export const selectors = createSelectors<Api.TreatmentPlanEntity>('treatmentPlans')
