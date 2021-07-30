import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import { withTranslation } from 'utilities/decorators';
import { deleteBinIcon } from 'images/icons/common';

import { Alert, AlertIntent, RoundedButtonIntent, InputGroup, Markdown } from 'Components/Common';

const Title = styled.p`
  margin-bottom: 8px;
  font-weight: bold;
`;

@withTranslation('Common/DeleteConfirmationDialog')
class DeleteConfirmationDialog extends React.PureComponent {
  static propTypes = {
    isOpen: PropTypes.bool,
    title: PropTypes.string,
    onCancelDelete: PropTypes.func.isRequired,
    onConfirmDelete: PropTypes.func.isRequired,
  }

  static defaultProps = {
    isOpen: false,
  }

  state = {
    confirmationText: '',
  }

  constructor(props) {
    super(props);

    this.confirmationTextbox = React.createRef();
  }

  componentDidUpdate(prevProps) {
    const { isOpen: previousOpen } = prevProps;
    const { isOpen } = this.props;
    if (isOpen && !previousOpen) {
      this.setState({
        confirmationText: '',
      });
    }
  }

  get isConfirmButtonDisabled() {
    const { i18n } = this.props;
    const { confirmationText } = this.state;
    const checkWord = i18n('CheckWord').toLowerCase();
    return confirmationText.toLowerCase() !== checkWord;
  }

  get actions() {
    const { i18n, onConfirmDelete, onCancelDelete } = this.props;

    return [
      {
        text: i18n('CancelButton.Text'),
        intent: RoundedButtonIntent.SECONDARY,
        onClick: onCancelDelete,
      },
      {
        text: i18n('ConfirmButton.Text'),
        intent: RoundedButtonIntent.SUCCESS,
        onClick: onConfirmDelete,
        disabled: this.isConfirmButtonDisabled,
      },
    ];
  }

  handleConfirmationTextChange = (confirmationText) => {
    this.setState({
      confirmationText,
    });
  }

  renderTitle() {
    const { i18n, title } = this.props;

    return (
      <>
        {title && (
          <Title>{title}</Title>
        )}
        <span><Markdown source={i18n('Description', { checkWord: i18n('CheckWord') })} /></span>
      </>
    );
  }

  render() {
    const {
      isOpen,
      onCancelDelete,
    } = this.props;

    const { confirmationText } = this.state;

    return (
      <Alert
        isOpen={isOpen}
        icon={deleteBinIcon}
        intent={AlertIntent.DANGER}
        title={this.renderTitle()}
        actions={this.actions}
        onClose={onCancelDelete}
      >
        <InputGroup
          value={confirmationText}
          onChange={this.handleConfirmationTextChange}
          inputRef={this.confirmationTextbox}
        />
      </Alert>
    );
  }
}

export { DeleteConfirmationDialog };
