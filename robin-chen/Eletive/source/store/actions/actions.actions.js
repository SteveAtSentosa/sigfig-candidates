import { createActionWithStatuses } from 'utilities/store';

import * as api from 'api/action';

export const createObjective = createActionWithStatuses(
  '[actions] create objective',
  objective => (dispatch) => {
    dispatch(createObjective.start());

    return api.createObjective(objective).then((createdObjective) => {
      if (createdObjective === null) {
        dispatch(createObjective.failure());
      } else {
        dispatch(createObjective.success(createdObjective));
      }
    });
  },
);

export const updateObjective = createActionWithStatuses(
  '[actions] update objective',
  objective => (dispatch) => {
    dispatch(updateObjective.start());

    return api.updateObjective(objective).then((updatedObjective) => {
      dispatch(updateObjective.success(updatedObjective));
    });
  },
);

export const deleteObjective = createActionWithStatuses(
  '[actions] delete objective',
  objective => (dispatch) => {
    dispatch(deleteObjective.start());

    return api.deleteObjective(objective).then(() => {
      dispatch(deleteObjective.success(objective));
    });
  },
);

export const fetchObjectiveList = createActionWithStatuses(
  '[actions] fetch objectives',
  organizationId => (dispatch, getState) => {
    const { app: { selectedOrganizationID } } = getState();
    const orgID = organizationId || selectedOrganizationID;
    dispatch(fetchObjectiveList.start());

    return api.fetchObjectiveList(orgID)
      .then((objectives) => {
        dispatch(fetchObjectiveList.success({ objectives }));
      })
      .catch(() => dispatch(fetchObjectiveList.failure()));
  },
);
