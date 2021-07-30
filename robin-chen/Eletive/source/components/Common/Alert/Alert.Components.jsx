import styled from 'styled-components';
import { SvgImage } from 'Components/Common';

export const AlertIntent = {
  DANGER: 'danger',
  SUCCESS: 'success',
};

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const IconContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50px;
  height: 50px;
  margin-bottom: 17px;
  border-radius: 50px;

  ${({ intent }) => intent === AlertIntent.SUCCESS && `
    background: linear-gradient(282.67deg, #74F4A1 10.68%, #62D382 90.82%);
  `}

  ${({ intent }) => intent === AlertIntent.DANGER && `
    background: linear-gradient(180deg, #FF5237 0%, #F68E7E 100%);
  `}
`;

export const Icon = styled(SvgImage)`
  height: 22px;
  color: #ffffff;
`;

export const Title = styled.div`
  max-width: 440px;
  color: #354a60;
  font-size: 18px;
  font-weight: 500;
  line-height: 27px;
  text-align: center;

  b {
    font-weight: 600;
  }
`;

export const Description = styled.p`
  max-width: 293px;
  margin: 8px 0 0 0;
  color: #98a6bc;
  font-size: 14px;
  line-height: 22px;
  text-align: center;
`;

export const ActionContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 22px;
`;

export const ButtonWrapper = styled.div`
  margin: 0 24px 18px 0;

  &:last-child {
    margin-right: 0;
  }
`;

export const ChildrenWrapper = styled.div`
  width: 100%;
  margin-top: 24px;
  padding: 0 20px;
`;
