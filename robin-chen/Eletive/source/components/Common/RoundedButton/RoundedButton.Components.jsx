
import styled from 'styled-components';

import { SvgImage, Button } from 'Components/Common';

const RoundedButtonIntent = {
  DANGER: 'danger',
  SUCCESS: 'success',
  SECONDARY: 'secondary',
};

const RoundedButtonSize = {
  NORMAL: 'normal',
  SMALL: 'small',
};

const Container = styled(Button)`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 15px ${props => (props.icon ? '30px' : '60px')};
  border: 1px solid transparent;
  border-radius: 40px;
  color: #707e93;
  background: transparent;
  font-weight: 600;
  font-size: 14px;
  letter-spacing: 0.1em;

  ${props => props.intent === RoundedButtonIntent.DANGER && `
    color: #ffffff;
    background: #f68e7e;
    box-shadow: 0px 4px 11px rgba(246, 142, 126, 0.58);

    &:hover {
      background: #ed7f6e;
    }

    &:focus {
      border: 1px solid #c85443;
    }
  `}

  ${props => props.intent === RoundedButtonIntent.SUCCESS && `
    color: #ffffff;
    background: linear-gradient(318deg, #74f4a1 10%, #62d382 90%);
    box-shadow: 0px 5px 19px rgba(102, 213, 135, 0.4);
    border: 1px solid #47df7c;

    &:hover {
      background: linear-gradient(317.94deg, #47df7c 10.68%, #44d36d 90.82%);
    }

    &:focus {
      border: 1px solid #2ea852;
    }
  `}

  ${props => props.intent === RoundedButtonIntent.SECONDARY && `
    color: #707e93;
    background: #ffffff;
    box-shadow: 0px 5px 19px rgba(53, 74, 96, 0.13);

    &:hover {
      border: 1px solid #98a6bc;
    }

    &:focus {
      border: 1px solid #66d587;
    }

    &:active {
      background: #e5eaf1;
      border: 1px solid transparent
    }
  `}

  ${props => props.size === RoundedButtonSize.SMALL && `
    padding: 10px 30px;
  `}

  &[disabled] {
    opacity: 0.6;
    cursor: not-allowed;
    pointer-events: none;
  }
`;

const LeftIcon = styled(SvgImage)`
  display: inline-block;
  flex: 0 0 auto;
  height: 16px;
  width: 16px;
  ${props => !props.iconOnly && `
    margin-right: 7px;
  `}
`;

const Text = styled.span`
  flex: 0 1 auto;
`;

export { Container, LeftIcon, Text, RoundedButtonIntent, RoundedButtonSize };
