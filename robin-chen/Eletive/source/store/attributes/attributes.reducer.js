import _ from 'lodash';
import produce from 'immer';
import { createReducer } from 'redux-act';

import { areSegmentsEqual, sortAttributes } from 'services/attributes';

import * as actions from './attributes.actions';

const initialState = {
  attributeList: [],
  attributeListFetchStatus: '',

  attributeCreateStatus: '',
  attributeUpdateStatus: '',
  attributeDeleteStatus: '',

  segmentManagerAddRequest: {
    user: null,
    status: '',
  },

  segmentManagerDeleteRequest: {
    user: null,
    status: '',
  },
};

const reducer = {
  [actions.fetchAttributeList.start]: state => ({
    ...state,
    attributeListFetchStatus: 'pending',
  }),

  [actions.fetchAttributeList.success]: (state, attributeList) => ({
    ...state,
    attributeList,
    attributeListFetchStatus: 'success',
  }),

  [actions.createAttribute.start]: state => ({
    ...state,
    attributeCreateStatus: 'pending',
  }),

  [actions.createAttribute.success]: (state, createdAttribute) => ({
    ...state,
    attributeList: [...state.attributeList, createdAttribute],
    attributeCreateStatus: 'success',
  }),

  [actions.updateAttribute.start]: state => ({
    ...state,
    attributeUpdateStatus: 'pending',
  }),

  [actions.updateAttribute.success]: (state, updatedAttribute) => {
    let attributeList = produce(state.attributeList, (draft) => {
      const index = _.findIndex(draft, organization => (
        organization.id === updatedAttribute.id
      ));

      draft.splice(index, 1, updatedAttribute);
    });

    attributeList = sortAttributes(attributeList);

    return {
      ...state,
      attributeList,
      attributeUpdateStatus: 'success',
    };
  },

  [actions.updateAttribute.failure]: state => ({
    ...state,
    attributeUpdateStatus: 'failure',
  }),

  [actions.deleteAttribute.start]: state => ({
    ...state,
    attributeDeleteStatus: 'pending',
  }),

  [actions.deleteAttribute.success]: (state, deletedAttribute) => {
    const attributeList = state.attributeList.filter(attribute => (
      attribute.id !== deletedAttribute.id
    ));

    return {
      ...state,
      attributeList,
      attributeDeleteStatus: 'success',
    };
  },

  [actions.addSegmentManager.start]: (state, user) => ({
    ...state,
    segmentManagerAddRequest: { user, status: 'pending' },
  }),

  [actions.addSegmentManager.success]: (state, { addedManager, segmentToAddManagerTo }) => {
    const updatedAttributeList = produce(state.attributeList, (draft) => {
      const attributeToUpdate = _.find(draft, attribute => attribute.id === segmentToAddManagerTo.attribute.id);
      const attributeSegmentToUpdate = _.find(attributeToUpdate.segments, segment => (
        areSegmentsEqual(segment, segmentToAddManagerTo)
      ));

      attributeSegmentToUpdate.managers.push(addedManager.id);
    });

    return {
      ...state,
      attributeList: updatedAttributeList,
      segmentManagerAddRequest: {
        ...state.segmentManagerAddRequest,
        status: 'success',
      },
    };
  },

  [actions.addSegmentManager.failure]: state => ({
    ...state,
    segmentManagerAddRequest: {
      ...state.segmentManagerDeleteRequest,
      status: 'failure',
    },
  }),

  [actions.deleteSegmentManager.start]: (state, user) => ({
    ...state,
    segmentManagerDeleteRequest: { user, status: 'pending' },
  }),

  [actions.deleteSegmentManager.success]: (state, { deletedManager, segmentToDeleteManagerFrom }) => {
    const updatedAttributeList = produce(state.attributeList, (draft) => {
      const attributeToUpdate = _.find(draft, attribute => attribute.id === segmentToDeleteManagerFrom.attribute.id);
      const attributeSegmentToUpdate = _.find(attributeToUpdate.segments, segment => (
        areSegmentsEqual(segment, segmentToDeleteManagerFrom)
      ));

      attributeSegmentToUpdate.managers = attributeSegmentToUpdate.managers
        .filter(managerID => managerID !== deletedManager.id);
    });

    return {
      ...state,
      attributeList: updatedAttributeList,
      segmentManagerDeleteRequest: {
        ...state.segmentManagerDeleteRequest,
        status: 'success',
      },
    };
  },

  [actions.deleteSegmentManager.failure]: state => ({
    ...state,
    segmentManagerDeleteRequest: {
      ...state.segmentManagerDeleteRequest,
      status: 'failure',
    },
  }),
};

export default createReducer(reducer, initialState);
