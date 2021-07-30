import React from 'react';
import PropTypes from 'prop-types';

import * as Own from './FormFieldset.Components';

class FormFieldset extends React.PureComponent {
  static propTypes = {
    legendText: PropTypes.string,
    children: PropTypes.node,
  };

  render() {
    const { legendText, children } = this.props;

    return (
      <Own.Fieldset>
        <Own.Legend>{legendText}</Own.Legend>
        {children}
      </Own.Fieldset>
    );
  }
}

export { FormFieldset };
