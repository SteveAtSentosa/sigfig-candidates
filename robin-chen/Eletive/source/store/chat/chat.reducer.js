import produce from 'immer';
import { createReducer } from 'redux-act';
import * as actions from './chat.actions';

const initialState = {
  chatMessages: [],
  fetchChatMessagesStatus: '',
  createChatMessageStatus: '',
  updateChatMessageStatus: '',
};

const reducer = {
  [actions.fetchChatMessages.start]: state => ({
    ...state,
    fetchChatMessagesStatus: 'pending',
  }),

  [actions.fetchChatMessages.success]: (state, chatMessages) => ({
    ...state,
    chatMessages,
    fetchChatMessagesStatus: 'success',
  }),

  [actions.createChatMessage.start]: state => ({
    ...state,
    createChatMessageStatus: 'pending',
  }),

  [actions.createChatMessage.success]: (state, createdChatMessage) => ({
    ...state,
    chatMessages: [...state.chatMessages, createdChatMessage],
    createChatMessageStatus: 'success',
  }),

  [actions.updateChatMessage.start]: state => ({
    ...state,
    updateChatMessageStatus: 'pending',
  }),

  [actions.updateChatMessage.success]: (state, updatedChatMessage) => {
    const chatMessages = produce(state.chatMessages, (draft) => {
      const chatList = draft;

      const index = chatList.findIndex(e => e.id === updatedChatMessage.id);
      chatList[index] = updatedChatMessage;
    });

    return {
      ...state,
      chatMessages,
      updateChatMessageStatus: 'success',
    };
  },
};

export default createReducer(reducer, initialState);
