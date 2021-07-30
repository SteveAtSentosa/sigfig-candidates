import React from 'react';
import PropTypes from 'prop-types';

import { exclamationCircleIcon } from 'images/icons/common';

import * as Own from './InformationTitle.Components';

class InformationTitle extends React.PureComponent {
  static propTypes = {
    children: PropTypes.node,
    onClick: PropTypes.func,
  }

  render() {
    const { children, onClick } = this.props;

    return (
      <Own.Container onClick={onClick}>
        {children}
        <Own.Icon source={exclamationCircleIcon} />
      </Own.Container>
    );
  }
}

export { InformationTitle };
