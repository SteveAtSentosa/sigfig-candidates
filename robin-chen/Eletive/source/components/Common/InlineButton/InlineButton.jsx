import React from 'react';
import PropTypes from 'prop-types';

import { Container, LeftIcon, Text } from './InlineButton.Components';

class InlineButton extends React.PureComponent {
  static propTypes = {
    children: PropTypes.node,
    type: PropTypes.string,
    disabled: PropTypes.bool,
    icon: PropTypes.node,
    text: PropTypes.string,
    large: PropTypes.bool,
    onClick: PropTypes.func,
    className: PropTypes.string,
  }

  static defaultProps = {
    type: 'button',
    large: false,
    className: '',
  }

  render() {
    const { children, ...restProps } = this.props;
    const { icon, text } = restProps;
    return (
      <Container data-cy="minimal-button" {...restProps}>
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

export { InlineButton };
