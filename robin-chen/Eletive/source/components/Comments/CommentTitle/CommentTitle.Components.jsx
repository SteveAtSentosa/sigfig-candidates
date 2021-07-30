import styled from 'styled-components';

import { SvgImage } from 'Components/Common';

const Container = styled.div`
  display: flex;
`;

const CommentIcon = styled(SvgImage)`
  flex-shrink: 0;
  width: 30px;
  height: 25px;
`;

const DetailsContainer = styled.div`
  margin-left: 17px;
`;

const Title = styled.p`
  position: relative;
  top: -3px;
  margin-bottom: 10px;
  color: #354a60;
  font-size: 14px;
  font-weight: 500;
  line-height: 21px;
  letter-spacing: 0.03em;
`;

const InfoContainer = styled.div`
  display: flex;
  align-items: center;
  color: #98a6bc;
  font-size: 12px;
  font-weight: 500;
  line-height: 13px;
`;

const InfoIcon = styled(SvgImage)`
  display: inline-flex;
  width: 13px;
  height: 13px;
  margin: 0 8px 0 0;
`;

const ManagerContainer = styled.div`
  display: flex;
  align-items: center;
  margin-left: 19px;
`;

const ManagerName = styled.p`
  margin-bottom: 6px;
  color: #707e93;
  font-size: 10px;
  font-weight: 500;
  line-height: 11px;

  &:last-child {
    margin-bottom: 0;
  }
`;

export default {
  Container,
  DetailsContainer,
  InfoContainer,
  Title,
  CommentIcon,
  InfoIcon,
  ManagerContainer,
  ManagerName,
};
