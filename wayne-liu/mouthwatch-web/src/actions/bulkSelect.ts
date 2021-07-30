import { EntityId } from '#/types'
import { defineAction } from 'redoodle'

export type Item = {
  id: EntityId
  [k: string]: any
}

// Actions

export const AddItem = defineAction('[bulkSelect] add item')<{ item: Item }>()
export const RemoveItem = defineAction('[bulkSelect] remove item')<{ item: Item }>()

export const ExportItems = defineAction('[bulkSelect] export')<{ zipName: string, mediaIds?: Item[] }>()
export const ExportUserImages = defineAction('[bulkSelect] export_user_images')<{ zipName: string }>()
export const ExportItemsSuccess = defineAction('[bulkSelect] export success')()
export const ExportItemsError = defineAction('[bulkSelect] export error')<{ error: Error }>()

export const ClearItems = defineAction('[bulkSelect] clear')()
