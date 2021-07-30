import styled from 'styled-components';
import { SvgImage } from 'Components/Common';

export const ObjectiveWrapper = styled.div`
  margin-top: 16px;
`;

export const Header = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  height: 50px;
  padding: 0 24px;
  border-radius: 5px;
  background-color: white;
  box-shadow: 0 4px 14px rgba(53, 74, 96, 0.08);

  ${props => props.expanded && `
    border-bottom: 1px solid #cccccc;
    border-bottom-left-radius: unset;
    border-bottom-right-radius: unset;
  `}
`;

export const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-grow: 1;
`;

export const HeaderMiddle = styled.div`
  display: flex;
  align-items: center;
  width: 200px;
  font-weight: 500;
  font-size: 14px;
  letter-spacing: 0.1em;
  color: #707e93;
`;

export const MobileHeader = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  height: 100px;
  border-radius: 5px;
  background-color: white;
  box-shadow: 0 4px 14px rgba(53, 74, 96, 0.08);

  ${props => props.expanded && `
    border-bottom: 1px solid #cccccc;
    border-bottom-left-radius: unset;
    border-bottom-right-radius: unset;
  `}
`;

export const MobileHeaderContent = styled.div`
  flex-grow: 1;
  border-left: 1px solid #98a6bc4a;
`;

export const MobileHeaderHalf = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 50px;
  padding-left: 20px;
`;

export const TitleWrapper = styled.div.attrs({
  'data-cy': 'objective-title',
})`
  display: flex;
  align-items: center;
  cursor: pointer;
`;

export const ArrowIcon = styled(SvgImage)`
  width: 14px;
  height: 14px;
  margin-right: 25px;
  stroke: #98a6bc;

  @media screen and (max-width: 768px) {
    margin: 0 4px;
  }
`;

export const SubTitle = styled.div`
  color: #98a6bc;
  font-size: 10px;
  font-weight: 500;
  letter-spacing: .05em;
`;

export const Title = styled.div`
  color: #707e93;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: .05em;
`;

export const Line = styled.div`
  position: absolute;
  top: 25px;
  left: -30px;
  bottom: 25px;
  width: 1px;
  background-color: #98a6bc80;

  @media screen and (max-width: 768px) {
    display: none;
  }
`;
