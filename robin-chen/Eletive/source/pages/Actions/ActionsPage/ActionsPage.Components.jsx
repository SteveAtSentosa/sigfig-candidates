import styled from 'styled-components';

import { SvgImage } from 'Components/Common';

export const TabsContainer = styled.div`
  border-bottom: 1px solid #C9d0db;
`;

export const FilterContainer = styled.div`
  display: flex;
  margin-top: 24px;

  @media screen and (max-width: 768px) {
    flex-direction: column;
  }
`;

export const ObjectiveDateWrap = styled.div`
  flex: 0 0 75%;
  ${({ isFullWidth }) => isFullWidth && 'flex-basis: 100%;'}

  @media screen and (max-width: 768px) {
    flex: unset;
  }
`;

export const StatusFilterWrap = styled.div`
  flex: 0 0 25%;
  min-width: 0;
  padding-left: 30px;

  @media screen and (max-width: 768px) {
    flex: unset;
    padding-left: unset;
  }
`;

export const PlusCircle = styled(SvgImage)`
  width: 32px;
  height: 32px;

  > svg {
  fill: #f68e7e;
  stroke: #ffffff;
}
`;

export const GreenCircle = styled(SvgImage)`
  margin-right: 8px;
  svg {
    width: 10px;
    fill: #66d587;
  }
`;

export const YellowCircle = styled(SvgImage)`
  margin-right: 8px;
  svg {
    width: 10px;
    fill: #f4bd3b;
  }
`;

export const RedCircle = styled(SvgImage)`
  margin-right: 8px;
  svg {
    width: 10px;
    fill: #f68e7e;
  }
`;

export const GreyCircle = styled(SvgImage)`
  margin-right: 8px;
  svg {
    width: 10px;
    fill: #c9d0db;
  }
`;
