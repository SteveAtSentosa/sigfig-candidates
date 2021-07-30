import { AppState } from '#/redux'

export function getGroupAccountOwnerCandidates (state: AppState) {
  return state.groups.accountOwnerCandidates
}
