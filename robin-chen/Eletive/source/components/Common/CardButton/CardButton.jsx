import styled from 'styled-components';
import { Button, SvgImage } from 'Components/Common';
import React from 'react';
import PropTypes from 'prop-types';
import { downChevronIcon } from 'images/icons/common';

const Container = styled(Button)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 50px;
  width: 100%;
  border: 1px solid transparent;
  border-radius: 5px;
  color: #707e93;
  background-color: #ffffff;
  box-shadow: 0 4px 14px rgba(53, 74, 96, 0.08);
  font-weight: 600;
  text-align: center;
  font-size: 14px;
  outline: 0;

  ${({ small }) => small && `
    height: 36px;
  `}

  &:hover {
    border: 1px solid #98a6bc;
  }

  &:focus {
    border: 1px solid #66d587;
    border-radius: 5px;

  }

  &[disabled] {
    background: #f4f6fa;
    border: 1px solid transparent;
    cursor: not-allowed;
  }

  &:active {
    box-shadow: 0 2px 7px rgba(53, 74, 96, 0.08);
  }
`;

const Icon = styled(SvgImage)`
  display: inline-flex;
  flex: 0 0 auto;
  height: 15px;
  width: 15px;

  color: #98a6bc;

  &:last-child {
    margin-right: 15px;
  }

  &:first-child {
    margin-left: 15px;
  }

`;

const DropdownIcon = styled(SvgImage).attrs({ source: downChevronIcon })`
  display: inline-flex;
  flex: 0 0 auto;
  height: 8px;
  width: 8px;
  margin-right: 15px;
  color: #98a6bc;
  transition: all 0.5s;

  ${props => props.open && `
    transform: scaleY(-1);
 `}
`;

const Text = styled.div`
  flex: 1 1 auto;
  margin: 0 15px;
  text-align: left;
  font-size: 12px;
  font-weight: 500;
`;

class CardButton extends React.PureComponent {
  static propTypes = {
    dropdown: PropTypes.bool,
    isPopoverOpen: PropTypes.bool,
    forwardedRef: PropTypes.object,
    children: PropTypes.node,
    type: PropTypes.string,
    disabled: PropTypes.bool,
    leftIcon: PropTypes.node,
    rightIcon: PropTypes.node,
    text: PropTypes.string,
    small: PropTypes.bool,
    onClick: PropTypes.func,
  }

  static defaultProps = {
    type: 'button',
    small: false,
  }

  render() {
    const { children, dropdown, isPopoverOpen, ...restProps } = this.props;
    const { leftIcon, rightIcon, text } = restProps;

    if (children) {
      return (
        <Container {...restProps}>
          { children }
        </Container>
      );
    }
    return (
      <Container {...restProps}>
        {leftIcon &&
        typeof leftIcon === 'string' ? <Icon source={leftIcon} /> : leftIcon
        }
        {text &&
        <Text>{text}</Text>
        }
        {rightIcon &&
        typeof rightIcon === 'string' ? <Icon source={rightIcon} /> : rightIcon
        }
        {dropdown &&
        <DropdownIcon open={isPopoverOpen} />
        }
      </Container>
    );
  }
}

export { CardButton };
