import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import moment from 'moment';

import { i18n } from 'utilities/decorators';
import { Card, SvgImage, UserAvatar } from 'Components/Common';
import { calendar } from 'images/comments';

const CardContainer = styled.div`
  max-width: 82%;
`;

const MessageContainer = styled.div`
  padding: 8px 16px;
  line-height: 20px;
  text-align: left;
`;

const AvatarContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row-reverse;
  margin-bottom: 7px;
  font-weight: 500;
  font-size: 14px;

  span {
    margin: 0 7px;
  }
`;

const DateContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-top: 8px;
  color: #98a6bc;
`;

const CalendarIcon = styled(SvgImage)`
  margin-right: 8px;
  svg{
    width: 16px;
    height: 16px;
  }
`;

const Container = styled.div`
  display: flex;
  justify-content: flex-end;
  margin: 15px 0;
  color: #707e93;
  font-size: 12px;

  ${props => props.isIncoming && `
    justify-content: flex-start;

    ${AvatarContainer} {
      flex-direction: inherit;
    }

    ${DateContainer} {
      justify-content: flex-start;
    }
  `}
`;

const MessageDate = ({ date }) => (
  <DateContainer>
    <CalendarIcon source={calendar} />
    {moment.unix(date).format('D MMM YYYY | HH:mm')}
  </DateContainer>
);

class ChatMessage extends React.PureComponent {
  static propTypes = {
    message: PropTypes.object,
    isIndividual: PropTypes.bool,
  }

  get isIncoming() {
    const { message } = this.props;
    return !message.user || !message.user.isCurrentUser;
  }

  renderAvatar = () => {
    const { message: { user }, isIndividual } = this.props;
    const isAnonymousYou = user && user.isCurrentUser && isIndividual;

    if (!user || isAnonymousYou) {
      return (
        <>
          <UserAvatar small anonym />
          <span>
            {i18n.global('Chat.AnonymousUser.Anonymous')}
            { isAnonymousYou && ` (${i18n.global('Chat.AnonymousUser.You')})` }
          </span>
        </>
      );
    }

    return (
      <>
        <UserAvatar small user={user} />
        <span>{user.firstName} {user.lastName}</span>
      </>
    );
  }

  render() {
    const { message } = this.props;

    return (
      <Container isIncoming={this.isIncoming}>
        <CardContainer>
          <Card>
            <MessageContainer>
              <AvatarContainer>
                { this.renderAvatar() }
              </AvatarContainer>
              {message.messageText}
              <MessageDate date={message.createdAt} />
            </MessageContainer>
          </Card>
        </CardContainer>
      </Container>
    );
  }
}

export { ChatMessage };
