import produce from 'immer';
import { createReducer } from 'redux-act';
import cache from 'api/cache';
import * as actions from './oneOnOnes.actions';

const initialState = {
  oneOnOneList: [],
  oneOnOneListCacheKey: null,
  fetchOneOnOneListStatus: '',
  createOneOnOneStatus: '',
  updateOneOnOneStatus: '',
  deleteOneOnOneStatus: '',

  oneOnOneTemplateList: [],
  oneOnOneTemplateListCacheKey: '',
  fetchOneOnOneTemplateListStatus: '',
  createOneOnOneTemplateStatus: '',
  updateOneOnOneTemplateStatus: '',
  deleteOneOnOneTemplateStatus: '',
};

// TODO: test set and update cache here with oneOnOneList ant reflect to others
const reducer = {
  [actions.fetchOneOnOneList.start]: state => ({
    ...state,
    fetchOneOnOneListStatus: 'pending',
  }),

  [actions.fetchOneOnOneList.success]: (state, { oneOnOneList, oneOnOneListCacheKey }) => {
    oneOnOneListCacheKey && cache.set(oneOnOneListCacheKey, oneOnOneList, 1);
    return {
      ...state,
      oneOnOneList,
      oneOnOneListCacheKey,
      fetchOneOnOneListStatus: 'success',
    };
  },

  [actions.fetchOneOnOneList.failure]: state => ({
    ...state,
    fetchOneOnOneListStatus: 'failure',
  }),

  [actions.createOneOnOne.start]: state => ({
    ...state,
    createOneOnOneStatus: 'pending',
  }),

  [actions.createOneOnOne.success]: (state, oneOnOne) => {
    const oneOnOneList = [...state.oneOnOneList, oneOnOne];
    cache.update(state.oneOnOneListCacheKey, oneOnOneList);
    return {
      ...state,
      oneOnOneList,
      createOneOnOneStatus: 'success',
    };
  },

  [actions.createOneOnOne.failure]: state => ({
    ...state,
    createOneOnOneStatus: 'failure',
  }),

  [actions.updateOneOnOne.start]: state => ({
    ...state,
    updateOneOnOneStatus: 'pending',
  }),

  [actions.updateOneOnOne.success]: (state, oneOnOne) => {
    const oneOnOneList = produce(state.oneOnOneList, (draft) => {
      const index = draft.findIndex(e => e.id === oneOnOne.id);
      draft.splice(index, 1, oneOnOne);
    });

    cache.update(state.oneOnOneListCacheKey, oneOnOneList);

    return {
      ...state,
      oneOnOneList,
      updateOneOnOneStatus: 'success',
    };
  },

  [actions.updateOneOnOne.failure]: state => ({
    ...state,
    updateOneOnOneStatus: 'failure',
  }),

  [actions.deleteOneOnOne.start]: state => ({
    ...state,
    deleteOneOnOneStatus: 'pending',
  }),

  [actions.deleteOneOnOne.success]: (state, { id, ids }) => {
    const { oneOnOneList: currentOneOnOneList } = state;

    const oneOnOneList = currentOneOnOneList
      .filter(({ id: templateID }) => templateID !== id && (!ids || !ids.includes(templateID)));

    cache.update(state.oneOnOneListCacheKey, oneOnOneList);

    return {
      ...state,
      oneOnOneList,
      deleteOneOnOneStatus: 'success',
    };
  },

  [actions.deleteOneOnOne.failure]: state => ({
    ...state,
    deleteOneOnOneStatus: 'failure',
  }),

  [actions.fetchOneOnOneTemplateList.start]: state => ({
    ...state,
    fetchOneOnOneTemplateListStatus: 'pending',
  }),

  [actions.fetchOneOnOneTemplateList.success]: (state, { oneOnOneTemplateList, oneOnOneTemplateListCacheKey }) => {
    oneOnOneTemplateListCacheKey && cache.set(oneOnOneTemplateListCacheKey, oneOnOneTemplateList, 1);
    return {
      ...state,
      oneOnOneTemplateList,
      oneOnOneTemplateListCacheKey,
      fetchOneOnOneTemplateListStatus: 'success',
    };
  },

  [actions.fetchOneOnOneTemplateList.failure]: state => ({
    ...state,
    fetchOneOnOneTemplateListStatus: 'failure',
  }),

  [actions.createOneOnOneTemplate.start]: state => ({
    ...state,
    createOneOnOneTemplateStatus: 'pending',
  }),

  [actions.createOneOnOneTemplate.success]: (state, oneOnOneTemplate) => {
    const oneOnOneTemplateList = [...state.oneOnOneTemplateList, oneOnOneTemplate];
    cache.update(state.oneOnOneTemplateListCacheKey, oneOnOneTemplateList);
    return {
      ...state,
      oneOnOneTemplateList,
      createOneOnOneTemplateStatus: 'success',
    };
  },

  [actions.createOneOnOneTemplate.failure]: state => ({
    ...state,
    createOneOnOneTemplateStatus: 'failure',
  }),

  [actions.updateOneOnOneTemplate.start]: state => ({
    ...state,
    updateOneOnOneTemplateStatus: 'pending',
  }),

  [actions.updateOneOnOneTemplate.success]: (state, oneOnOneTemplate) => {
    const oneOnOneTemplateList = produce(state.oneOnOneTemplateList, (draft) => {
      const index = draft.findIndex(e => e.id === oneOnOneTemplate.id);
      draft.splice(index, 1, oneOnOneTemplate);
    });

    cache.update(state.oneOnOneTemplateListCacheKey, oneOnOneTemplateList);
    return {
      ...state,
      oneOnOneTemplateList,
      updateOneOnOneTemplateStatus: 'success',
    };
  },

  [actions.updateOneOnOneTemplate.failure]: state => ({
    ...state,
    updateOneOnOneTemplateStatus: 'failure',
  }),

  [actions.deleteOneOnOneTemplate.start]: state => ({
    ...state,
    deleteOneOnOneTemplateStatus: 'pending',
  }),


  [actions.deleteOneOnOneTemplate.success]: (state, oneOnOneTemplateID) => {
    const { oneOnOneTemplateList: currentOneOnOneTemplateList } = state;

    const oneOnOneTemplateList = currentOneOnOneTemplateList.filter(({ id }) => id !== oneOnOneTemplateID);

    cache.update(state.oneOnOneTemplateListCacheKey, oneOnOneTemplateList);
    return {
      ...state,
      oneOnOneTemplateList,
      deleteOneOnOneTemplateStatus: 'success',
    };
  },

  [actions.deleteOneOnOneTemplate.failure]: state => ({
    ...state,
    deleteOneOnOneTemplateStatus: 'failure',
  }),

};

export default createReducer(reducer, initialState);
