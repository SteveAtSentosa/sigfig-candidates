import { createReducer } from 'redux-act';
import { produce } from 'immer';
import * as comments from './comments.actions';

const initialState = {
  commentList: [],
  fetchCommentListStatus: '',
  createCommentStatus: '',
  updateCommentStatus: '',
};

const reducer = {
  [comments.fetchCommentList.start]: state => ({
    ...state,
    fetchCommentListStatus: 'pending',
  }),

  [comments.fetchCommentList.success]: (state, commentList) => ({
    ...state,
    commentList,
    fetchCommentListStatus: 'success',
  }),

  [comments.createComment.start]: state => ({
    ...state,
    createCommentStatus: 'pending',
  }),

  [comments.createComment.success]: (state, createdComment) => ({
    ...state,
    commentList: [...state.commentList, createdComment],
    createCommentStatus: 'success',
  }),

  [comments.updateComment.start]: state => ({
    ...state,
    updateCommentStatus: 'pending',
  }),

  [comments.updateComment.success]: (state, updatedComment) => {
    const commentList = produce(state.commentList, (draft) => {
      const index = draft.findIndex(comment => (
        comment.id === updatedComment.id
      ));

      draft.splice(index, 1, updatedComment);
    });

    return {
      ...state,
      commentList,
      updateCommentStatus: 'success',
    };
  },

  [comments.setCommentAsRead]: (state, commentId) => {
    const commentList = produce(state.commentList, (draft) => {
      const comment = draft.find(item => (
        item.id === commentId
      ));
      if (comment) {
        comment.chatStatistic.unreadMessagesCount = 0;
      }
    });
    return {
      ...state,
      commentList,
    };
  },
  [comments.addChatMessageToComment]: (state, commentId) => {
    const commentList = produce(state.commentList, (draft) => {
      const comment = draft.find(item => (
        item.id === commentId
      ));
      comment.chatStatistic.messagesCount += 1;
    });
    return {
      ...state,
      commentList,
    };
  },
};

export default createReducer(reducer, initialState);
