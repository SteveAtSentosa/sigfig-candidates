import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { ScreenSizes } from 'utilities/common';

class ScreenSwitcher extends React.PureComponent {
  static propTypes = {
    largerScreenContent: PropTypes.node,
    smallerScreenContent: PropTypes.node,
    threshold: PropTypes.number,
    screenSize: PropTypes.number,
  }

  static defaultProps = {
    largerScreenContent: null,
    smallerScreenContent: null,
    threshold: ScreenSizes.sm,
  }

  render() {
    const { largerScreenContent, smallerScreenContent, threshold, screenSize } = this.props;

    return screenSize > threshold ? largerScreenContent : smallerScreenContent;
  }
}

const mapStateToProps = ({ app }) => {
  const { screenSize } = app;

  return {
    screenSize,
  };
};

const ConnectedScreenSwitcher = connect(mapStateToProps)(ScreenSwitcher);

export { ConnectedScreenSwitcher as ScreenSwitcher };
