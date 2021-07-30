import { AddAvatar, ClearAvatars } from '#/actions/avatars'
import { TypedReducer, setWith } from 'redoodle'

// State
export interface Avatar { id: string, lambdaUrl: string }
export interface State {
  byId: Avatar[]
}

export const initialState: State = {
  byId: []
}

function createReducer () {
  const reducer = TypedReducer.builder<State>()

  reducer.withHandler(AddAvatar.TYPE, (state, payload) => {
    return setWith(state, {
      byId: [...state.byId.filter(e => e.id !== payload.id), payload]
    })
  })

  reducer.withHandler(ClearAvatars.TYPE, state => {
    return setWith(state, {
      byId: []
    })
  })

  return reducer.build()
}

export const reducer = createReducer()
