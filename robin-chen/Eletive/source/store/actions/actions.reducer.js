import produce from 'immer';
import { createReducer } from 'redux-act';
import * as actions from './actions.actions';

const initialState = {
  objectives: [],
};

const reducer = {
  [actions.createObjective.success]: (state, objective) => ({
    ...state,
    objectives: [...state.objectives, objective],
  }),

  [actions.updateObjective.success]: (state, objective) => {
    const objectives = produce(state.objectives, (draft) => {
      const objectiveList = draft;

      const index = objectiveList.findIndex(e => e.id === objective.id);
      objectiveList[index] = objective;
    });

    return {
      ...state,
      objectives,
    };
  },

  [actions.deleteObjective.success]: (state, objective) => {
    const { objectives: currentObjectives } = state;

    const objectives = currentObjectives.filter(({ id }) => id !== objective.id);

    return {
      ...state,
      objectives,
    };
  },

  [actions.fetchObjectiveList.success]: (state, { objectives }) => ({
    ...state,
    objectives,
  }),
};

export default createReducer(reducer, initialState);
