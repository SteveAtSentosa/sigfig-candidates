import React from 'react';
import PropTypes, {} from 'prop-types';
import styled from 'styled-components';

import { SvgImage } from 'Components/Common';

export const Container = styled.div`
  display: flex;
  justify-content: space-between;

  @media screen and (max-width: 768px) {
    flex-direction: column;
  }
`;

const ChoiceContent = styled.div`
  max-width: 215px;
  text-align: left;
`;

export const ChoiceTitle = styled.span`
  display: inline-block;
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 21px;
  color: #354a60;
`;

export const ChoiceDescription = styled.span`
  display: inline-block;
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  line-height: 20px;
  color: #98a6bc;
`;

export const ChoiceContainer = styled.button.attrs({
  type: 'button',
})`
  display: flex;
  flex-grow: 1;
  padding: 20px;
  background: none;
  border: none;
  cursor: pointer;

  ${props => props.selected && `
    background-color: #ffffff;
    border-radius: 10px;
    box-shadow: 0px 5px 25px rgba(36, 73, 134, 0.1);
  `}

  ${props => props.disabled && `
    cursor: default;
  `}

  ${props => props.disabled && !props.selected && `
    opacity: 0.6;
  `}

  ${ChoiceContent} {
    margin-left: 20px;
  }
`;

export const ChoiceIcon = styled(SvgImage)`
  display: inline-block;
  width: 44px;
  height: 44px;
`;

export const Choice = ({ title, description, selected, icon, onClick, disabled }) => (
  <ChoiceContainer
    selected={selected}
    disabled={disabled}
    onClick={onClick}
    data-cy={title}
  >
    <ChoiceIcon source={icon} />

    <ChoiceContent>
      <ChoiceTitle>{title}</ChoiceTitle>
      <ChoiceDescription>{description}</ChoiceDescription>
    </ChoiceContent>
  </ChoiceContainer>
);

class SwitchChoice extends React.PureComponent {
  static propTypes = {
    value: PropTypes.any,
    disabled: PropTypes.bool,
    choices: PropTypes.arrayOf(PropTypes.shape({
      value: PropTypes.any.isRequired,
      icon: PropTypes.node.isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string,
    })),
    onChange: PropTypes.func.isRequired,
  }

  static defaultProps = {
    disabled: false,
  }


  handleSelect = (choice) => {
    const { value, onChange } = this.props;
    if (value !== choice.value) {
      onChange(choice.value);
    }
  }

  render() {
    const { value, choices, disabled } = this.props;
    return (
      <Container>
        {choices.map(choice => (
          <Choice
            key={choice.value}
            title={choice.title}
            description={choice.description}
            selected={choice.value === value}
            disabled={disabled}
            icon={choice.icon}
            onClick={() => this.handleSelect(choice)}
          />
        ))}
      </Container>
    );
  }
}

export { SwitchChoice };
