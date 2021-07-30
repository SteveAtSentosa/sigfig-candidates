import styled from 'styled-components';
import { SvgImage } from 'Components/Common';

export const ListContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 24px;
  border: 1px solid #c9d0db;
  border-radius: 5px;
`;

export const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 40px;
  padding: 4px 0;
`;

export const EmptyIcon = styled(SvgImage)`
  margin-bottom: 4px;
  color: #98a6bc;
  svg {
    width: 36px;
    height: 36px;
  }
`;

export const EmptyText = styled.div`
  margin-bottom: 8px;
  font-weight: 500;
  font-size: 12px;
  color: #98a6bc;
  `;
