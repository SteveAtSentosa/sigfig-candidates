import styled from 'styled-components';
import { InputStyled, SvgImage, Button } from 'Components/Common';

export const Input = styled(InputStyled)`
  padding-right: 40px;
  ${props => props.mini && `
    padding: 7.5px 15px 5px 5px;
  `}
`;

export const Container = styled.div`
  position: relative;
`;

export const ButtonsContainer = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  top: 0;
  right: 0;
  width: 40px;
  ${props => props.mini && `
    width: 15px;
  `}
  height: 100%;
`;

export const ChevronButton = styled(Button)`
  color: #98a6bc;
  &:hover {
    color: #354a60;
  }

  &:focus {
    color: #66d587;
  }
`;

export const Icon = styled(SvgImage)`
  svg {
    width: 11px;
    ${props => props.mini && `
      width: 7px;
    `}
  }
`;
