import styled from 'styled-components';

import { SvgImage, Button } from 'Components/Common';

const Container = styled(Button)`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  min-width: 30px;
  min-height: 30px;
  padding: 5px 10px;
  border: 1px solid transparent;
  color: #707e93;
  background-color: transparent;
  font-weight: 600;
  text-align: center;
  font-size: 12px;

  ${({ large }) => large && `
    padding: 5px 20px;
    font-size: 14px;
  `}

  &:hover {
    color: #354a60;
  }

  &:focus {
    border: 1px solid #66d587;
    border-radius: 5px;
    outline: 0 !important;
  }

  &[disabled] {
    color: #c1cad7;
    cursor: not-allowed;
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
  line-height: 16px;
`;

export { Container, LeftIcon, Text };
