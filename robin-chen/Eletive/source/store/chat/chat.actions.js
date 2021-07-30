import { actions } from 'store';
import { createActionWithStatuses } from 'utilities/store';

import * as api from 'api/chat';
import cache from 'api/cache';

export const fetchChatMessages = createActionWithStatuses(
  '[chat] fetch chat messages',
  chatSubjectID => (dispatch) => {
    const query = api.queries.fetchChatMessageList(chatSubjectID);

    if (cache.contains(query)) {
      const cachedChatMessageList = cache.get(query);
      dispatch(fetchChatMessages.success(cachedChatMessageList));

      return Promise.resolve(cachedChatMessageList);
    }

    dispatch(fetchChatMessages.start(chatSubjectID));
    return api.fetchChatMessageList(chatSubjectID)
      .then((chatMessageList) => {
        dispatch(fetchChatMessages.success(chatMessageList));
        cache.set(query, chatMessageList);
      })
      .catch(() => dispatch(fetchChatMessages.failure()));
  },
);

export const createChatMessage = createActionWithStatuses(
  '[chat] create chat message',
  (chatSubjectID, chatMessage) => (dispatch) => {
    dispatch(createChatMessage.start());

    return api.createChatMessage(chatSubjectID, chatMessage)
      .then((createdChatMessage) => {
        dispatch(createChatMessage.success(createdChatMessage));
        dispatch(actions.comments.addChatMessageToComment(chatSubjectID));
      })
      .catch(() => dispatch(createChatMessage.failure()));
  },
);

export const updateChatMessage = createActionWithStatuses(
  '[chat] update chat message',
  (chatSubjectID, chatMessage) => (dispatch) => {
    dispatch(updateChatMessage.start());

    return api.updateChatMessage(chatSubjectID, chatMessage)
      .then((updatedChatMesssage) => {
        dispatch(updateChatMessage.success(updatedChatMesssage));
      })
      .catch(() => dispatch(updateChatMessage.failure()));
  },
);
