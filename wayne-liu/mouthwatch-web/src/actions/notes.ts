import * as Api from '#/api'

import { AccountEntity } from '#/api/types'
import { EntityId, Note } from '#/types'

import { defineAction } from 'redoodle'

// Actions

export const SortNotes = defineAction('[notes] sort_notes')<{ sortBy: string }>()
export const GetNotes = defineAction('[notes] get_notes')<{ sortBy?: string }>()
export const GetNoteById = defineAction('[notes] get_note_by_id')<{ id: EntityId, associations?: Api.AssociationValue }>()

export const CreateNote = defineAction('[notes] create note')<{ data: Api.CreateNoteEntity }>()
export const CreateNoteSuccess = defineAction('[notes] create_note_success')<{ note: Note }>()
export const CreateNoteError = defineAction('[notes] create_note_error')<{ error: Error }>()

export const EditNote = defineAction('[notes] edit note')<{ id: string, patchedNote: Api.PatchedEntity, updated_at: string, appointmentId?: EntityId, mediaId?: EntityId, patientId?: EntityId }>()
export const EditNoteSuccess = defineAction('[notes] edit_note_success')<{ note: Note }>()
export const EditNoteError = defineAction('[notes] edit_note_error')<{ error: Error }>()

export const DeleteNote = defineAction('[notes] delete note')<{ id: EntityId, appointmentId?: EntityId, mediaId?: EntityId, patientId?: EntityId }>()
export const DeleteNoteSuccess = defineAction('[notes] delete_note_success')()
export const DeleteNoteError = defineAction('[notes] delete_note_error')<{ error: Error }>()

export const AddCreatorsById = defineAction('[notes] add_creators_by_id')<{ creators: AccountEntity[] }>()
