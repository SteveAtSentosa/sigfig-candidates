import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { actions } from 'store';
import { Chat as ChatModel } from 'Models';

import { Chat } from './Chat';

class ChatContainer extends React.PureComponent {
  static propTypes = {
    chatSubject: PropTypes.number,
    chatMessages: ChatModel.ChatMessages,
    isIndividual: PropTypes.bool,
    initialMessage: ChatModel.ChatMessage,
    titleRender: PropTypes.func,
    headerRender: PropTypes.func,
    fetchChatMessages: PropTypes.func,
    createChatMessage: PropTypes.func,
    updateChatMessage: PropTypes.func,
    setCommentAsRead: PropTypes.func,
  }

  readSetTimer = null;

  async componentDidMount() {
    const { chatSubject, fetchChatMessages } = this.props;

    await fetchChatMessages(chatSubject);
  }

  componentDidUpdate(prevProps) {
    const { chatMessages } = this.props;
    const { chatMessages: prevChatMessages } = prevProps;

    if (chatMessages !== prevChatMessages) {
      this.clearReadSetTimer();
      this.readSetTimer = setTimeout(this.setAsRead, 3000);
    }
  }

  componentWillUnmount() {
    this.clearReadSetTimer();
  }

  setAsRead = async () => {
    const { setCommentAsRead, updateChatMessage, chatSubject, chatMessages } = this.props;
    const unreadMessages = chatMessages.filter(({ isUnread }) => isUnread);
    await Promise.all(unreadMessages.map(({ id }) => updateChatMessage(id, { read: true })));
    setCommentAsRead(chatSubject);
  }

  handleSendMessage = (messageText) => {
    const { chatSubject, createChatMessage } = this.props;
    createChatMessage(chatSubject, { messageText });
  }

  clearReadSetTimer() {
    if (this.readSetTimer) {
      clearTimeout(this.readSetTimer);
    }
  }

  render() {
    const { chatMessages, isIndividual, titleRender, headerRender, initialMessage, chatSubject } = this.props;

    const chatMessagesWithComment = initialMessage ? [initialMessage, ...chatMessages] : chatMessages;
    return (
      <Chat
        chatSubject={chatSubject}
        chatMessages={chatMessagesWithComment}
        isIndividual={isIndividual}
        titleRender={titleRender}
        headerRender={headerRender}
        onSendMessage={this.handleSendMessage}
      />
    );
  }
}

const mapStateToProps = ({ chat }) => {
  const { chatMessages } = chat;

  return {
    chatMessages,
  };
};

const ConnectedChatContainer = connect(mapStateToProps, {
  ...actions.chat,
  ...actions.comments,
})(ChatContainer);

export { ConnectedChatContainer as ChatContainer };
