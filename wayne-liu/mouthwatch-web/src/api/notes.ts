import { Note, EntityId } from '#/types'
import { DataResponse, CreateNoteEntity, PatchedEntity } from './types'
import { makeAuthedJsonRequest, buildCollisionPatch } from './common'

/**
 * Creates a new note
 */
export const createNote = (authToken: string) => (note: CreateNoteEntity) => {
  return makeAuthedJsonRequest<DataResponse<Note>>('/notes', {
    authToken,
    method: 'POST',
    body: note
  })
}

export const editNote = (authToken: string) => (id: EntityId, note: PatchedEntity, updatedAt: string, bypassCollisionHandling = false) => {
  return makeAuthedJsonRequest<DataResponse<Note>>(`/notes/${id}`, {
    authToken,
    method: 'PATCH',
    body: buildCollisionPatch(note, updatedAt, bypassCollisionHandling)
  })
}

/**
 * Delete note
 */
export const deleteNote = (authToken: string) => (id: EntityId) => {
  return makeAuthedJsonRequest(`/notes/${id}`, {
    authToken,
    method: 'DELETE'
  })
}
