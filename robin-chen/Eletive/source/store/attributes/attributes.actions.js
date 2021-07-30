import { createActionWithStatuses } from 'utilities/store';

import { sortAttributeSegments } from 'services/attributes';
import { AttributeTypes } from 'Constants/Attributes';

import * as api from 'api/attributes';
import cache from 'api/cache';

const updateAttributeListCache = organizationID => (dispatch, getState) => {
  const query = api.queries.fetchAttributeList(organizationID);
  const { attributes: { attributeList } } = getState();

  cache.set(query, attributeList, 1);
};

export const fetchAttributeList = createActionWithStatuses(
  '[attributes] fetch attribute list',
  organizationID => (dispatch, getState) => {
    const { app: { selectedOrganizationID } } = getState();
    const orgID = organizationID || selectedOrganizationID;
    const query = api.queries.fetchAttributeList(orgID);

    if (cache.contains(query)) {
      const cachedAttributeList = cache.get(query);
      dispatch(fetchAttributeList.success(cachedAttributeList));

      return Promise.resolve(cachedAttributeList);
    }

    dispatch(fetchAttributeList.start());

    return api.fetchAttributeList(orgID)
      .then((attributes) => {
        const sortedAttributes = attributes.map(attribute => sortAttributeSegments(attribute));

        dispatch(fetchAttributeList.success(sortedAttributes));
        cache.set(query, sortedAttributes, 1);
        return sortedAttributes;
      });
  },
);

export const createAttribute = createActionWithStatuses(
  '[attributes] create attribute',
  (type, name) => (dispatch, getState) => {
    const { app: { selectedOrganizationID } } = getState();

    dispatch(createAttribute.start());

    const attributeToCreate = {
      type,
      name,
      organization: selectedOrganizationID,
      segments: [],
      reportToMembers: false,
      allowAsFilterInReport: type === AttributeTypes.Numbers || type === AttributeTypes.Dates,
    };

    return api.createAttribute(attributeToCreate)
      .then((createdAttribute) => {
        dispatch(createAttribute.success(createdAttribute));
        dispatch(updateAttributeListCache(createdAttribute.organization));

        return createdAttribute;
      })
      .catch(() => {
        dispatch(createAttribute.failure());
      });
  },
);

export const updateAttribute = createActionWithStatuses(
  '[attributes] update attribute',
  attributeToUpdate => (dispatch) => {
    dispatch(updateAttribute.start());

    return api.updateAttribute(attributeToUpdate)
      .then((updatedAttribute) => {
        const sortedAttribute = sortAttributeSegments(updatedAttribute);

        dispatch(updateAttribute.success(sortedAttribute));
        dispatch(updateAttributeListCache(sortedAttribute.organization));
      })
      .catch((error) => {
        dispatch(updateAttribute.failure());
        throw error;
      });
  },
);

export const deleteAttribute = createActionWithStatuses(
  '[attributes] delete attribute',
  attributeToDelete => (dispatch) => {
    dispatch(deleteAttribute.start());

    return api.deleteAttribute(attributeToDelete.id)
      .then(() => {
        dispatch(deleteAttribute.success(attributeToDelete));
        dispatch(updateAttributeListCache(attributeToDelete.organization));
      })
      .catch(() => {
        dispatch(deleteAttribute.failure());
      });
  },
);

export const addSegmentManager = createActionWithStatuses(
  '[attributes] add segment manager',
  (user, attribute, segment) => (dispatch) => {
    dispatch(addSegmentManager.start(user));

    return api.addSegmentManager(user.id, attribute.id, segment.id)
      .then(() => {
        dispatch(addSegmentManager.success({
          addedManager: user,
          segmentToAddManagerTo: segment,
        }));
        dispatch(updateAttributeListCache(segment.attribute.organization));
      })
      .catch(() => {
        dispatch(addSegmentManager.failure());
      });
  },
);

export const deleteSegmentManager = createActionWithStatuses(
  '[attributes] delete segment manager',
  (user, segment) => (dispatch) => {
    dispatch(deleteSegmentManager.start(user));

    return api.deleteSegmentManager(user.id, segment.id)
      .then(() => {
        dispatch(deleteSegmentManager.success({
          deletedManager: user,
          segmentToDeleteManagerFrom: segment,
        }));
        dispatch(updateAttributeListCache(segment.attribute.organization));
      })
      .catch(() => {
        dispatch(deleteSegmentManager.failure());
      });
  },
);
