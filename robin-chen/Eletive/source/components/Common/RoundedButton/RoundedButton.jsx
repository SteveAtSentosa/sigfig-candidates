import React from 'react';
import PropTypes from 'prop-types';

import { Container, LeftIcon, Text, RoundedButtonIntent, RoundedButtonSize } from './RoundedButton.Components';

class RoundedButton extends React.PureComponent {
  static propTypes = {
    children: PropTypes.node,
    type: PropTypes.string,
    disabled: PropTypes.bool,
    icon: PropTypes.node,
    text: PropTypes.string,
    intent: PropTypes.string,
    size: PropTypes.string,
    onClick: PropTypes.func,
    className: PropTypes.string,
  }

  static defaultProps = {
    type: 'button',
    disabled: false,
    className: '',
  }

  render() {
    const { children, ...restProps } = this.props;
    const { icon, text } = restProps;
    return (
      <Container {...this.props} data-cy="large-button">
        {icon &&
        <LeftIcon source={icon} iconOnly={!text} />
        }
        {text &&
        <Text>{text}</Text>
        }
        { children }
      </Container>
    );
  }
}

export { RoundedButton, RoundedButtonIntent, RoundedButtonSize };
