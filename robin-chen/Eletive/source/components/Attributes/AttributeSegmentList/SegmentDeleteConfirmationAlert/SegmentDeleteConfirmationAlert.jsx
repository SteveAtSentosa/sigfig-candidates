import React from 'react';
import PropTypes from 'prop-types';

import { withTranslation } from 'utilities/decorators';
import * as AttributeModels from 'Models/Attributes';
import { Alert, AlertIntent, Markdown, RoundedButtonIntent } from 'Components/Common';
import { deleteBinIcon } from 'images/icons/common';

@withTranslation('SegmentDeleteConfirmationAlert')
class SegmentDeleteConfirmationAlert extends React.PureComponent {
  static propTypes = {
    segment: AttributeModels.Segment,
    onCancelDelete: PropTypes.func,
    onConfirmDelete: PropTypes.func,
  }

  get actions() {
    const { i18n, onCancelDelete, onConfirmDelete } = this.props;

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
      },
    ];
  }

  render() {
    const { i18n, segment, onCancelDelete } = this.props;

    return (
      <Alert
        isOpen={segment}
        icon={deleteBinIcon}
        intent={AlertIntent.DANGER}
        actions={this.actions}
        title={segment &&
          <Markdown source={i18n('Text', { segmentName: segment.name })} />
        }
        onClose={onCancelDelete}
      />
    );
  }
}

export { SegmentDeleteConfirmationAlert };
