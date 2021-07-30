/* eslint-disable no-restricted-globals */
import React from 'react';
import PropTypes from 'prop-types';

import { withTranslation } from 'utilities/decorators';
import formDraft from 'utilities/formDraft';

import { TextArea, RoundedButton, RoundedButtonIntent } from 'Components/Common';
import * as OwnComponents from './NewChatMessages.Components';

@withTranslation('NewChatMessage')
class NewChatMessage extends React.PureComponent {
  static propTypes = {
    chatSubject: PropTypes.number,
    onSendMessage: PropTypes.func,
  }

  constructor(props) {
    super(props);

    const draft = formDraft.get(this.chatFormKey);

    this.state = {
      text: draft ? draft.text : '',
    };
  }

  get chatFormKey() {
    const { chatSubject } = this.props;
    return `NewChatMessage${chatSubject}`;
  }

  handleTextChange = (value) => {
    this.setState({
      text: value,
    });
    formDraft.set(this.chatFormKey, {
      text: value,
    });
  }

  handleSendClick = () => {
    const { onSendMessage } = this.props;
    const { text } = this.state;

    onSendMessage && onSendMessage(text);
    this.setState({ text: '' });
    formDraft.clear(this.chatFormKey);
  }

  render() {
    const { i18n } = this.props;
    const { text } = this.state;

    return (
      <OwnComponents.Container>
        <OwnComponents.TextAreaWrapper>
          <TextArea
            value={text}
            placeholder={i18n('Placeholder')}
            onChange={this.handleTextChange}
          />
        </OwnComponents.TextAreaWrapper>
        <OwnComponents.ButtonWrapper>
          <RoundedButton
            text={i18n('Send')}
            intent={RoundedButtonIntent.SUCCESS}
            disabled={!text}
            onClick={this.handleSendClick}
          />
        </OwnComponents.ButtonWrapper>
      </OwnComponents.Container>
    );
  }
}

export { NewChatMessage };
