import { createAction } from 'redux-act';
import { createActionWithStatuses } from 'utilities/store';

import * as api from 'api/comments';
import cache from 'api/cache';

export const fetchCommentList = createActionWithStatuses(
  '[comments] fetch comment list',
  () => (dispatch, getState) => {
    const { app: { selectedOrganizationID, language } } = getState();
    const query = api.queries.fetchCommentList(selectedOrganizationID);

    if (cache.contains(query)) {
      const cachedCommentList = cache.get(query);
      dispatch(fetchCommentList.success(cachedCommentList));

      return Promise.resolve(cachedCommentList);
    }
    dispatch(fetchCommentList.start());

    return api.fetchCommentList(selectedOrganizationID, language)
      .then((commentList) => {
        dispatch(fetchCommentList.success(commentList));
        cache.set(query, commentList);
      })
      .catch(() => dispatch(fetchCommentList.failure()));
  },
);

export const createComment = createActionWithStatuses(
  '[comments] create comment',
  comment => (dispatch) => {
    dispatch(createComment.start());

    return api.createComment(comment)
      .then((createdComment) => {
        dispatch(createComment.success(createdComment));
      })
      .catch(() => dispatch(createComment.failure()));
  },
);

export const updateComment = createActionWithStatuses(
  '[comments] update comment',
  comment => (dispatch) => {
    dispatch(updateComment.start());

    return api.updateComment(comment)
      .then((updatedComment) => {
        dispatch(updateComment.success(updatedComment));
      })
      .catch(() => dispatch(updateComment.failure()));
  },
);

export const setCommentAsRead = createAction('[comments] set comments as read');

export const addChatMessageToComment = createAction('[comments] add chat message to comment');
