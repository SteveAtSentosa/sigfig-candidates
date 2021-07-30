import styled from 'styled-components';
import { SvgImage } from 'Components/Common';

export const Container = styled.div`
  width: 100%;
`;

export const Label = styled.div`
  width: 15px;
  height: 15px;
`;

export const ClockIcon = styled(SvgImage)`
  width: 14px;
  height: 14px;
  margin-right: 8px;
`;

export const TimezoneItem = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
`;
