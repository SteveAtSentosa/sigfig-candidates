import * as Api from '#/api'
import { defineAction } from 'redoodle'
import { EntityId, ConfirmedData } from '#/types'

export const ThrowCollisionStart = defineAction('[collisions] throw collision start')<{ existingRecord: any, patchedRecord: Api.PatchedEntity, namespace: string }>()
export const ThrowCollisionEnd = defineAction('[collisions] throw collision end')<{ transformedRecord: any, existingRecord: any, patchedRecord: Api.PatchedEntity, namespace: string }>()
export const ThrowCollisionError = defineAction('[collisions] throw collision error')<{ error: Error }>()
export const ReadyToConfirm = defineAction('[collisions] ready to confirm')<{ id: EntityId, confirmedData: ConfirmedData }>()
export const ResolveCollisionStart = defineAction('[collisions] resolve collision start')<{ id: EntityId, namespace?: string, confirmedData?: ConfirmedData, existingRecord?: any, sendConfirmedData: boolean }>()
export const ResolveCollisionEnd = defineAction('[collisions] resolve collision end')<{ id: EntityId }>()
