import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { calculatorIcon, calendarIcon } from 'images/icons/common';
import { NameAbbreviation, SvgImage } from 'Components/Common';

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  color: white;
  font-weight: 600;
  font-size: 9px;
`;

const Icon = styled(SvgImage)`
  svg {
    width: 8px;
    height: 8px;
  }
`;

class SegmentIcon extends React.PureComponent {
  static propTypes = {
    name: PropTypes.string,
    icon: PropTypes.string,
    color: PropTypes.string,
    style: PropTypes.object,
  }

  static defaultProps = {
    color: '#16498b',
  }

  get style() {
    const { style, color } = this.props;

    return {
      ...style,
      color,
      backgroundColor: `${color}1A`,
    };
  }

  get iconSvg() {
    const { icon } = this.props;
    switch (icon) {
      case 'calendar': return calendarIcon;
      case 'calculator': return calculatorIcon;
      default: return '';
    }
  }

  render() {
    const { name } = this.props;

    return (
      <Container style={this.style}>
        {
          name &&
          <NameAbbreviation>{name}</NameAbbreviation>
        }
        {
          this.iconSvg &&
          <Icon source={this.iconSvg} />
        }
      </Container>
    );
  }
}

export { SegmentIcon };
