import React from 'react';
import PropTypes from 'prop-types';

import { withTranslation } from 'utilities/decorators';

import * as Own from './DemoModeHeader.Components';

@withTranslation('DemoModeHeader')
class DemoModeHeader extends React.PureComponent {
  static propTypes = {
    onSwitchDemoMode: PropTypes.func.isRequired,
  }

  handleBackToOrganizationButtonClick = () => {
    const { onSwitchDemoMode } = this.props;
    onSwitchDemoMode();
  }

  render() {
    const { i18n } = this.props;

    return (
      <Own.Container>
        <span>{i18n('Label')}</span>

        <Own.BackToOrganizationButton
          onClick={this.handleBackToOrganizationButtonClick}
        >
          {i18n('BackToOrganizationButton.Text')}
        </Own.BackToOrganizationButton>
      </Own.Container>
    );
  }
}

export { DemoModeHeader };
