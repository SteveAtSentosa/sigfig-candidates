import React from 'react';
import PropTypes from 'prop-types';

import { withTranslation } from 'utilities/decorators';

import { Dialog, DialogBody, ButtonContainer, SubmitButton } from './GdprDialog.Components';

@withTranslation('Application/GdprDialog')
class GdprDialog extends React.PureComponent {
  static propTypes = {
    isOpen: PropTypes.bool,
    isLoading: PropTypes.bool,
    onSubmit: PropTypes.func.isRequired,
  }

  static defaultProps = {
    isOpen: false,
    isLoading: false,
  }

  render() {
    const { i18n, isOpen, isLoading, onSubmit } = this.props;

    // TODO: get rid of dangerouslySetInnerHTML
    return (
      <Dialog title={i18n('Title')} isOpen={isOpen} isCloseButtonShown={false}>
        <DialogBody>
          <p dangerouslySetInnerHTML={{ __html: i18n('Content') }} />

          <ButtonContainer>
            <SubmitButton text={i18n('Button.Text')} loading={isLoading} onClick={onSubmit} />
          </ButtonContainer>
        </DialogBody>
      </Dialog>
    );
  }
}

export { GdprDialog };
