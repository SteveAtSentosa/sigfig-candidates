import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { radioSelectedIcon, radioUnselectedIcon } from 'images/icons/common';
import { SvgImage } from '../SvgImage/SvgImage';
import { Button } from '../Button/Button';

const Container = styled.div`
  display: flex;
  flex-direction: ${props => (props.isVertical ? 'column' : 'row')};

  &:focus{

  }
`;

const RadioButton = styled(Button)`
  display: flex;
  align-items: center;
  padding: 4px;
  background: transparent;
  border: 0;
  border-radius: 5px;
  cursor: pointer;

  > i {
    color: #c9d0db;
  }

  &:focus {
    outline: 0;

    > i {
      color: #66d587;
    }
  }

  &:hover {
  background: #f4f6fa;
    > i {
      color: #66d587;
    }
  }

  ${props => (props.isVertical ? `
    margin-top: 2px;
    &:first-child {
      margin-top: 0;
    }
  ` : `
    margin-left: 16px;
    &:first-child {
      margin-left: 0;
    }
  `)}

  ${props => props.highlightSelection && `
    padding: 12px 16px;
    margin-top: unset;
  `}

  ${props => props.highlighted && `
    border-radius: 5px;
    background-color: #f4f6fa;
  `}
`;

const RadioButtonIcon = styled(SvgImage)`
  display: flex;
  width: 16px;
  height: 16px;
  margin-right: 8px;
  user-select: none;
`;

const RadioButtonContent = styled.div`
  display: flex;
  align-items: center;

  svg {
    width: 10px;
    height: 10px;
    margin-right: 8px;
  }
`;

const RadioButtonTitleContainer = styled.div`
  text-align: start;
`;
const RadioButtonContentTitle = styled.p`
  margin: 0;
  color: #707e93;
  font-size: 12px;
  font-weight: 500;
  line-height: 20px;
  user-select: none;
`;

const RadioButtonContentSubTitle = styled.p`
  margin: 0;
  color: #c5cbd4;
  font-size: 11px;
  font-weight: 300;
  line-height: 20px;
  user-select: none;
`;

class RadioButtonList extends React.PureComponent {
  static propTypes = {
    isHorizontal: PropTypes.bool,
    selectedValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    items: PropTypes.arrayOf(PropTypes.shape({
      key: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      icon: PropTypes.SvgImage,
    })),
    highlightSelection: PropTypes.bool,
    preSelection: PropTypes.bool,
    onChange: PropTypes.func,
  };

  static defaultProps = {
    items: [],
    highlightSelection: false,
    preSelection: true,
  };

  state = {
    selectedValue: null,
  }

  constructor(props) {
    super(props);

    const { selectedValue, preSelection } = this.props;

    if (selectedValue) {
      this.state = { selectedValue };
    } else if (preSelection) {
      const { items } = this.props;
      if (items && items.length > 0) {
        this.state = {
          selectedValue: items[0].key,
        };
      }
    }
  }

  componentDidUpdate(prevProps) {
    const { selectedValue } = this.props;
    const { selectedValue: prevSelectedValue } = prevProps;

    if (selectedValue !== prevSelectedValue) {
      this.setState({ selectedValue });
    }
  }

  handleChange = key => (event) => {
    event.stopPropagation();
    this.setState({
      selectedValue: key,
    });
    const { onChange } = this.props;
    onChange(key);
  }

  defaultItemRenderer(item) {
    if (item.icon) {
      return (
        <RadioButtonContent>
          {item.icon}
          <RadioButtonTitleContainer>
            <RadioButtonContentTitle>{item.title}</RadioButtonContentTitle>
            {item.subTitle && <RadioButtonContentSubTitle>{item.subTitle}</RadioButtonContentSubTitle>}
          </RadioButtonTitleContainer>
        </RadioButtonContent>
      );
    }

    return (
      <RadioButtonContent>
        <RadioButtonTitleContainer>
          <RadioButtonContentTitle>{item.title}</RadioButtonContentTitle>
          {item.subTitle && <RadioButtonContentSubTitle>{item.subTitle}</RadioButtonContentSubTitle>}
        </RadioButtonTitleContainer>
      </RadioButtonContent>
    );
  }

  render() {
    const { isHorizontal, items, highlightSelection } = this.props;
    const { selectedValue } = this.state;

    return (
      <Container isVertical={!isHorizontal}>
        {
          items.map((item) => {
            const isSelected = item.key === selectedValue;
            const icon = isSelected ? radioSelectedIcon : radioUnselectedIcon;

            return (
              <RadioButton
                key={item.key}
                onClick={this.handleChange(item.key)}
                isVertical={!isHorizontal}
                highlightSelection={highlightSelection}
                highlighted={highlightSelection && isSelected}
              >
                <RadioButtonIcon source={icon} />
                {this.defaultItemRenderer(item)}
              </RadioButton>
            );
          })
        }
      </Container>
    );
  }
}

export { RadioButtonList };
