import produce from 'immer';
import { createAction } from 'redux-act';
import cache from 'api/cache';

export function createActionWithStatuses(actionBaseName, actionFunction) {
  /* eslint-disable no-param-reassign */
  actionFunction.start = createAction(`${actionBaseName} / start`);
  actionFunction.success = createAction(`${actionBaseName} / success`);
  actionFunction.failure = createAction(`${actionBaseName} / failure`);
  /* eslint-enable no-param-reassign */

  return actionFunction;
}

export const commonReducers = {
  fetch: (key, action) => {
    const cacheKey = `${key}CacheKey`;
    const statusKey = `fetch${key.charAt(0).toUpperCase() + key.substring(1)}Status`;
    return {
      [action.start]: state => ({
        ...state,
        [statusKey]: 'pending',
      }),
      [action.success]: (state, data) => {
        const [list, cacheKeyValue] = data;
        cacheKeyValue && cache.set(cacheKeyValue, list);
        return {
          ...state,
          [key]: list,
          [cacheKey]: cacheKeyValue,
          [statusKey]: 'success',
        };
      },
      [action.failure]: state => ({
        ...state,
        [statusKey]: 'failure',
      }),
    };
  },
  create: (key) => {
    const cacheKey = `${key}CacheKey`;
    return (state, item) => {
      const list = [...state[key], item];
      cache.update(state[cacheKey], list);
      return {
        ...state,
        [key]: list,
      };
    };
  },
  update: (key) => {
    const cacheKey = `${key}CacheKey`;
    return (state, item) => {
      const list = produce(state[key], (draft) => {
        const index = draft.findIndex(({ id }) => id === item.id);
        draft.splice(index, 1, item);
      });
      cache.update(state[cacheKey], list);
      return {
        ...state,
        [key]: list,
      };
    };
  },
  delete: (key) => {
    const cacheKey = `${key}CacheKey`;
    return (state, id) => {
      const list = state[key].filter(item => item.id !== id);
      cache.update(state[cacheKey], list);
      return {
        ...state,
        [key]: list,
      };
    };
  },
};
