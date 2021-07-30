import React from 'react';
import PropTypes from 'prop-types';

import { withTranslation } from 'utilities/decorators';
import { exclamationIcon } from 'images/icons/common';

import { Alert, AlertIntent, RoundedButtonIntent } from 'Components/Common';

@withTranslation('Application/PerformSurveyAlert')
class PerformSurveyAlert extends React.PureComponent {
  static propTypes = {
    isOpen: PropTypes.bool,
    onConfirm: PropTypes.func,
  };

  get actions() {
    const { i18n, onConfirm } = this.props;

    return [
      {
        text: i18n('ConfirmButton.Text'),
        intent: RoundedButtonIntent.SECONDARY,
        onClick: onConfirm,
      },
    ];
  }

  render() {
    const { i18n, isOpen } = this.props;

    return (
      <Alert
        isOpen={isOpen}
        icon={exclamationIcon}
        intent={AlertIntent.SUCCESS}
        title={<b>{i18n('Title')}</b>}
        description={i18n('Content')}
        actions={this.actions}
      />
    );
  }
}

export { PerformSurveyAlert };
