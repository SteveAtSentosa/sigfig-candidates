import React from 'react';
import PropTypes from 'prop-types';

import { withTranslation } from 'utilities/decorators';
import Constants from 'Constants/Comments';
import { Chat } from 'Models';

import {
  acknowledgeActive,
  acknowledgeInactive,
  chat,
} from 'images/comments';

import { SidePanel, SingleSelect as Select } from 'Components/Common';
import { ChatContainer } from 'Components/Chat';
import * as OwnComponents from './CommentHeader.Components';

@withTranslation('CommentHeader')
class CommentHeader extends React.PureComponent {
  static propTypes = {
    commentID: PropTypes.number,
    messageCount: PropTypes.number,
    unreadCount: PropTypes.number,
    label: PropTypes.number,
    initialChatMessage: Chat.ChatMessage,
    acknowledge: PropTypes.bool,
    isIndividual: PropTypes.bool,
    isChat: PropTypes.bool,
    onOpenChat: PropTypes.func,
    onUpdateAcknowledge: PropTypes.func,
    onEditLabel: PropTypes.func,
    chatTitleRender: PropTypes.func,
    chatHeaderRender: PropTypes.func,
  }

  static defaultProps = {
    messageCount: 0,
    unreadCount: 0,
    label: Constants.Labels.No,
    acknowledge: false,
  }

  state = {
    isChatOpen: false,
  }

  get totalCount() {
    const { messageCount, i18n, isChat } = this.props;

    return (
      <>
        { i18n('MessageCount.TotalCount', { totalCount: messageCount }) }
        <OwnComponents.DesktopOnly isChat={isChat}>
          { ` ${i18n('MessageCount.InThisChat')}` }
        </OwnComponents.DesktopOnly>
      </>
    );
  }

  get unreadCount() {
    const { unreadCount, i18n, isChat } = this.props;

    return (
      <>
        (
        { `${unreadCount}` }
        {isChat ?
          ` ${i18n('MessageCount.Unread')}`
          :
          <OwnComponents.DesktopOnly isChat={isChat}>
            { ` ${i18n('MessageCount.Unread')}` }
          </OwnComponents.DesktopOnly>
        }
        )
      </>
    );
  }

  get acknowledgeIcon() {
    const { acknowledge } = this.props;

    return acknowledge ? acknowledgeActive : acknowledgeInactive;
  }

  handleChatClick = () => {
    const { onOpenChat } = this.props;

    this.setState(({ isChatOpen }) => ({ isChatOpen: !isChatOpen }));
    onOpenChat && onOpenChat();
  }

  handleAcknowledgeClick = () => {
    const { acknowledge, onUpdateAcknowledge } = this.props;

    if (!acknowledge) {
      onUpdateAcknowledge && onUpdateAcknowledge(!acknowledge);
    }
  }

  handleChangeLabel = ({ id }) => {
    const { onEditLabel } = this.props;

    onEditLabel && onEditLabel(id);
  }

  renderLabelSelector = () => {
    const { label, i18n } = this.props;
    const labelItems = [
      { id: Constants.Labels.Important, color: Constants.LabelColors.Important, title: i18n('Labels.Important') },
      { id: Constants.Labels.FollowUp, color: Constants.LabelColors.FollowUp, title: i18n('Labels.FollowUp') },
      { id: Constants.Labels.Idea, color: Constants.LabelColors.Idea, title: i18n('Labels.Idea') },
      { id: Constants.Labels.No, color: Constants.LabelColors.NoLabel, title: i18n('Labels.No') },
    ];
    const selectedLabel = labelItems.find(({ id }) => id === label);

    return (
      <OwnComponents.SelectWrapper>
        <Select
          items={labelItems}
          activeItem={selectedLabel}
          onItemSelect={this.handleChangeLabel}
          itemRenderer={this.renderItem}
          minimal
        />
      </OwnComponents.SelectWrapper>
    );
  }

  renderItem = ({ title, color }) => (
    <OwnComponents.Label>
      <OwnComponents.LabelCircle color={color} />
      <OwnComponents.LabelTitle>{ title }</OwnComponents.LabelTitle>
    </OwnComponents.Label>
  )

  render() {
    const { commentID, i18n, isIndividual, chatTitleRender, chatHeaderRender, isChat, initialChatMessage } = this.props;
    const { isChatOpen } = this.state;

    return (
      <OwnComponents.HeaderContainer>
        <OwnComponents.Container>
          <OwnComponents.TotalCount>
            { this.totalCount }
          </OwnComponents.TotalCount>
          <OwnComponents.UnreadCount>
            { this.unreadCount }
          </OwnComponents.UnreadCount>
        </OwnComponents.Container>
        <OwnComponents.Container>
          {isChat ?
            <OwnComponents.DesktopOnly isChat={isChat}>
              {this.renderLabelSelector()}
            </OwnComponents.DesktopOnly>
            :
            this.renderLabelSelector()
          }
          {!isChat &&
            <>
              <OwnComponents.HeaderButton
                icon={chat}
                title={`${i18n('Buttons.Chat')}`}
                onClick={this.handleChatClick}
              />
              {
                !isIndividual &&
                <OwnComponents.HeaderButton
                  icon={this.acknowledgeIcon}
                  title={`${i18n('Buttons.Acknowledge')}`}
                  onClick={this.handleAcknowledgeClick}
                />
              }
            </>
          }
        </OwnComponents.Container>

        {!isChat &&
        <SidePanel
          isOpen={isChatOpen}
          onClose={this.handleChatClick}
        >
          <ChatContainer
            chatSubject={commentID}
            initialMessage={initialChatMessage}
            isIndividual={isIndividual}
            titleRender={chatTitleRender}
            headerRender={chatHeaderRender}
          />
        </SidePanel>
        }
      </OwnComponents.HeaderContainer>
    );
  }
}

export { CommentHeader };
