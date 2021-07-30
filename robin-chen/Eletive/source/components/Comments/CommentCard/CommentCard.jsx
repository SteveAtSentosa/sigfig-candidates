import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { Comments, User } from 'Models';
import { withTranslation } from 'utilities/decorators';
import { Targets } from 'utilities/reports';

import { Card } from 'Components/Common';
import * as OwnComponents from './CommentCard.Components';
import { CommentHeader } from '../CommentHeader/CommentHeader';
import { CommentTitle } from '../CommentTitle/CommentTitle';

@withTranslation()
class CommentCard extends React.PureComponent {
  static propTypes = {
    target: PropTypes.number.isRequired,
    comment: Comments.Comment.isRequired,
    currentUser: User.User,
    onOpenChat: PropTypes.func,
    onUpdateAcknowledge: PropTypes.func,
    onEditLabel: PropTypes.func.isRequired,
  }

  get isIndividual() {
    const { target } = this.props;
    return target === Targets.Individual;
  }

  get commentLabel() {
    const {
      target,
      comment: { organizationLabel, individualLabel, segmentsLabel } } = this.props;
    if (target === Targets.Individual) {
      return individualLabel;
    }
    if (target === Targets.Segments) {
      return segmentsLabel;
    }
    if (target === Targets.Organization) {
      return organizationLabel;
    }
    throw new Error('Wrong route');
  }

  get commentHeaderProps() {
    const {
      comment: { id, commentText, leftByMe, createdAt,
        chatStatistic: { messagesCount, unreadMessagesCount }, acknowledge,
      },
      currentUser,
      onOpenChat, onUpdateAcknowledge, onEditLabel,
    } = this.props;

    const initialChatMessage = {
      messageText: commentText,
      createdAt,
      isUnread: false,
      user: leftByMe && currentUser ? {
        firstName: currentUser.firstName,
        lastName: currentUser.lastName,
        isCurrentUser: true,
      } : null,
    };

    return {
      commentID: id,
      messageCount: messagesCount,
      unreadCount: unreadMessagesCount,
      initialChatMessage,
      label: this.commentLabel,
      acknowledge,
      isIndividual: this.isIndividual,
      onOpenChat,
      onUpdateAcknowledge,
      onEditLabel,
      chatTitleRender: () => <CommentTitle {...this.commentTitleProps} />,
      chatHeaderRender: () => <CommentHeader {...this.commentHeaderProps} isChat />,
    };
  }

  get commentTitleProps() {
    const { comment: { title, createdAt, managers }, i18n } = this.props;
    const commentTitle = title || i18n.global('Comment.CommonQuestion');

    return { title: commentTitle, timestamp: createdAt, managers, isIndividual: this.isIndividual };
  }

  render() {
    const { comment: { commentText } } = this.props;

    return (
      <Card>
        <OwnComponents.HeaderWrapper>
          <CommentHeader
            {...this.commentHeaderProps}
          />
        </OwnComponents.HeaderWrapper>
        <OwnComponents.Content>
          <CommentTitle
            {...this.commentTitleProps}
          />
          <OwnComponents.CommentText>
            { commentText }
          </OwnComponents.CommentText>
        </OwnComponents.Content>
      </Card>
    );
  }
}

const mapStateToProps = ({ auth: { currentUser } }) => ({
  currentUser,
});

const ConnectedCommentCard = connect(mapStateToProps)(CommentCard);

export { ConnectedCommentCard as CommentCard };
