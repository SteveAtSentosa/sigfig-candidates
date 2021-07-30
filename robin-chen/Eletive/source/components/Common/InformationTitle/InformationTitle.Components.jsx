import styled from 'styled-components';
import { SvgImage } from 'Components/Common';

export const Container = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
`;

export const Icon = styled(SvgImage)`
  width: 16px;
  height: 16px;
  margin-left: 5px;
  color: #98a6bc;
  line-height: 0;
`;
