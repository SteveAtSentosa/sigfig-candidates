import styled from 'styled-components';
import { Button } from 'Components/Common';

export const Container = styled.div`
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  height: 49px;
  color: #ffffff;
  background-color: #98a6bc;
  font-weight: bold;
  font-size: 12px;
  line-height: 18px;
`;

export const BackToOrganizationButton = styled(Button)`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 10px;
  width: 118px;
  height: 22px;
  border-radius: 2px;
  font-weight: 500;
  font-size: 12px;
  color: #ffffff;
  background: #66d587;

  &:focus, &:hover {
    box-shadow: 0 5px 19px rgba(53, 74, 96, .15);
  }
`;
