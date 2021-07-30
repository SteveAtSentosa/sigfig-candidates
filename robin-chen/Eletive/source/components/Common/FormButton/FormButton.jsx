import React from 'react';
import PropTypes from 'prop-types';

import * as Own from './FormButton.Components';

class FormButton extends React.PureComponent {
  static propTypes = {
    forwardedRef: PropTypes.object,
    fullWidth: PropTypes.bool,
    disabled: PropTypes.bool,
    small: PropTypes.bool,
    minimal: PropTypes.bool,
    icon: PropTypes.node,
    rightIcon: PropTypes.node,
    text: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  };

  render() {
    const { icon, rightIcon, text, ...restProps } = this.props;

    return (
      <Own.Container {...restProps}>
        {icon &&
        typeof icon === 'string' ? <Own.Icon noText={!text} source={icon} /> : icon
        }
        {text && <Own.Text>{text}</Own.Text>}
        {rightIcon &&
        typeof rightIcon === 'string' ? <Own.Icon right noText={!text} source={rightIcon} /> : rightIcon
        }
      </Own.Container>
    );
  }
}

export { FormButton };
