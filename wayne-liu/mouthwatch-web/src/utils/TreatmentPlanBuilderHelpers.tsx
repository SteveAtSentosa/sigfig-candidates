import { UpdateData, UpdateLayout, treatmentPlanDraftSelector } from '#/actions/treatmentPlans'
import { LayoutSection, SectionTypes } from '#/types'
import { put, select } from 'redux-saga/effects'
import { omit } from 'lodash'

const formatSectionObject = (id: string, type: SectionTypes) => {
  return { id, type }
}

const formatBlankDataObject = (type: string) => {
  let section = { title: '' }
  switch (type) {
    case 'images':
      section = Object.assign({}, section, { media: {}, order: [], columns: 2 })
      break
    case 'provider_notes':
      section = Object.assign({}, section, { text: '' })
      break
    case 'procedures':
      section = Object.assign({}, section, { procedures: [], order: [] })
      break
  }
  return section
}

export function* addSectionLayout (id: string, type: SectionTypes, idAbove?: string) {
  const section = formatSectionObject(id, type)
  const draft = yield select(treatmentPlanDraftSelector)
  const { layout: { sections } } = draft
  if (idAbove) {
    const existingIndex = sections.findIndex(sec => sec.id === idAbove)
    const sectionsCopy: LayoutSection[] = Array.from(sections)
    sectionsCopy.splice(existingIndex, 0, section)
    yield put(UpdateLayout({ sections: [ ...sectionsCopy ] }))
  } else {
    yield put(UpdateLayout({ sections: [ ...sections, section ] }))
  }
}

export function* initSectionData (sectionId: string, sectionType: SectionTypes) {
  const values = formatBlankDataObject(sectionType)
  yield put(UpdateData({ sectionId, sectionType, values }))
}

export function* duplicateSectionData (fromId: string, toId: string) {
  const draft = yield select(treatmentPlanDraftSelector)
  const copy = Object.assign({}, draft.data.find(s => s.section_id === fromId))
  yield put(UpdateData({
    sectionId: toId,
    sectionType: copy.section_type,
    values: { ...omit(copy, ['section_id', 'section_type']) }
  }))
}
