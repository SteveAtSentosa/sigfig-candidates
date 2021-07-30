import { createActionWithStatuses } from 'utilities/store';

import * as api from 'api/oneOnOnes';
import cache from 'api/cache';

export const fetchOneOnOneList = createActionWithStatuses(
  '[oneOnOnes] fetch oneOnOnes',
  () => (dispatch) => {
    const oneOnOneListCacheKey = api.queries.fetchOneOnOneList();

    if (cache.contains(oneOnOneListCacheKey)) {
      const cached = cache.get(oneOnOneListCacheKey);
      dispatch(fetchOneOnOneList.success({ oneOnOneList: cached, oneOnOneListCacheKey }));

      return Promise.resolve(cached);
    }

    dispatch(fetchOneOnOneList.start());
    return api.fetchOneOnOneList()
      .then((oneOnOneList) => {
        dispatch(fetchOneOnOneList.success({ oneOnOneList, oneOnOneListCacheKey }));
      })
      .catch(() => dispatch(fetchOneOnOneList.failure()));
  },
);

export const createOneOnOne = createActionWithStatuses(
  '[oneOnOnes] create oneOnOne',
  oneOnOne => (dispatch) => {
    dispatch(createOneOnOne.start());

    return api.createOneOnOne(oneOnOne)
      .then((createdOneOnOne) => {
        dispatch(createOneOnOne.success(createdOneOnOne));
      })
      .catch(() => dispatch(createOneOnOne.failure()));
  },
);

export const updateOneOnOne = createActionWithStatuses(
  '[oneOnOnes] update oneOnOne',
  oneOnOne => (dispatch) => {
    dispatch(updateOneOnOne.start());

    return api.updateOneOnOne(oneOnOne)
      .then(updatedOneOnOne => dispatch(updateOneOnOne.success(updatedOneOnOne)))
      .catch(() => dispatch(updateOneOnOne.failure()));
  },
);

export const deleteOneOnOne = createActionWithStatuses(
  '[oneOnOnes] delete oneOnOne',
  (id, ids) => (dispatch) => {
    dispatch(deleteOneOnOne.start());

    return api.deleteOneOnOne(id, ids)
      .then(() => dispatch(deleteOneOnOne.success({ id, ids })))
      .catch(() => dispatch(deleteOneOnOne.failure()));
  },
);

export const fetchOneOnOneTemplateList = createActionWithStatuses(
  '[oneOnOnes] fetch oneOnOneTemplates',
  () => (dispatch, getState) => {
    const { app: { selectedOrganizationID } } = getState();
    const oneOnOneTemplateListCacheKey = api.queries.fetchOneOnOneTemplateList(selectedOrganizationID);

    if (cache.contains(oneOnOneTemplateListCacheKey)) {
      const cached = cache.get(oneOnOneTemplateListCacheKey);
      dispatch(fetchOneOnOneTemplateList.success({ oneOnOneTemplateList: cached, oneOnOneTemplateListCacheKey }));

      return Promise.resolve(cached);
    }

    dispatch(fetchOneOnOneTemplateList.start());
    return api.fetchOneOnOneTemplateList(selectedOrganizationID)
      .then((oneOnOneTemplateList) => {
        dispatch(fetchOneOnOneTemplateList.success({ oneOnOneTemplateList, oneOnOneTemplateListCacheKey }));
      })
      .catch(() => dispatch(fetchOneOnOneTemplateList.failure()));
  },
);

export const createOneOnOneTemplate = createActionWithStatuses(
  '[oneOnOnes] create oneOnOneTemplate',
  oneOnOneTemplate => (dispatch, getState) => {
    const { app: { selectedOrganizationID } } = getState();
    dispatch(createOneOnOneTemplate.start());

    return api.createOneOnOneTemplate(oneOnOneTemplate, selectedOrganizationID)
      .then(createdOneOnOneTemplate => dispatch(createOneOnOneTemplate.success(createdOneOnOneTemplate)))
      .catch(() => dispatch(createOneOnOneTemplate.failure()));
  },
);

export const updateOneOnOneTemplate = createActionWithStatuses(
  '[oneOnOnes] update oneOnOneTemplate',
  oneOnOneTemplate => (dispatch) => {
    dispatch(updateOneOnOneTemplate.start());

    return api.updateOneOnOneTemplate(oneOnOneTemplate)
      .then(updatedOneOnOneTemplate => dispatch(updateOneOnOneTemplate.success(updatedOneOnOneTemplate)))
      .catch(() => dispatch(updateOneOnOneTemplate.failure()));
  },
);

export const deleteOneOnOneTemplate = createActionWithStatuses(
  '[oneOnOnes] delete oneOnOneTemplate',
  oneOnOneTemplateID => (dispatch) => {
    dispatch(deleteOneOnOneTemplate.start());

    return api.deleteOneOnOneTemplate(oneOnOneTemplateID)
      .then(() => dispatch(deleteOneOnOneTemplate.success(oneOnOneTemplateID)))
      .catch(() => dispatch(deleteOneOnOneTemplate.failure()));
  },
);
