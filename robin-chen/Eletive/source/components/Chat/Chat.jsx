import React from 'react';
import PropTypes from 'prop-types';
import { Scrollbars } from 'react-custom-scrollbars';

import { ChatMessage } from './ChatMessage/ChatMessage';
import { NewChatMessage } from './NewChatMessage/NewChatMessage';
import * as OwnComponents from './Chat.Components';


class Chat extends React.PureComponent {
  static propTypes = {
    chatSubject: PropTypes.number,
    chatMessages: PropTypes.arrayOf(PropTypes.object),
    isIndividual: PropTypes.bool,
    titleRender: PropTypes.func,
    headerRender: PropTypes.func,
    onSendMessage: PropTypes.func,
  }

  get messageCount() {
    const { chatMessages } = this.props;
    return chatMessages.length;
  }

  get unreadMessageCount() {
    const { chatMessages } = this.props;
    return chatMessages.filter(e => e.isUnread).length;
  }

  render() {
    const { chatMessages, isIndividual, titleRender, headerRender, onSendMessage, chatSubject } = this.props;

    return (
      <OwnComponents.Container>
        {headerRender && headerRender()}
        <Scrollbars autoHide autoHeight autoHeightMin="20px" autoHeightMax="calc( 100vh - 43px )">
          <OwnComponents.ContentContainer>
            {titleRender &&
            <OwnComponents.TitleContainer>
              {titleRender()}
            </OwnComponents.TitleContainer>
            }

            {chatMessages.map(message => (
              <ChatMessage
                key={message.id}
                message={message}
                isIndividual={isIndividual}
              />
            ))
            }
            <NewChatMessage chatSubject={chatSubject} onSendMessage={onSendMessage} />
          </OwnComponents.ContentContainer>
        </Scrollbars>
      </OwnComponents.Container>
    );
  }
}

export { Chat };
