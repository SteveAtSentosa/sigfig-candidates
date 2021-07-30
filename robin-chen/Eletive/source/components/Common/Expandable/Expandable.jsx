import React from 'react';
import PropTypes from 'prop-types';

import * as Own from './Expandable.Components';

class Expandable extends React.PureComponent {
  static propTypes = {
    header: PropTypes.node.isRequired,
    children: PropTypes.node.isRequired,
    expanded: PropTypes.bool,
  }

  render() {
    const { header, expanded, children } = this.props;

    return (
      <Own.Container expanded={expanded}>
        {header}
        {expanded &&
        <Own.ChildrenContainer>
          <Own.Line />
          {children}
        </Own.ChildrenContainer>
        }
      </Own.Container>
    );
  }
}

export { Expandable };
