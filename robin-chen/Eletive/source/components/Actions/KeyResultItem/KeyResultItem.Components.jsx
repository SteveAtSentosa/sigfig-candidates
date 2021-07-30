import styled from 'styled-components';

export const Title = styled.div`
  margin-bottom: 15px;
  padding-bottom: 15px;
  color: #707e93;
  font-size: 14px;
  font-weight: 600;
  border-bottom: 2px solid #c9d0db;
`;

export const FormGroupContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 25px;

  @media screen and (max-width: 768px) {
    flex-wrap: wrap;
  }
`;

export const InputWrapper = styled.div`
  ${props => props.width && `
    flex-basis: ${props.width}%;
  `}

  & > div {
    width: 100%;
  }

  @media screen and (max-width: 768px) {
    flex-basis: 100%;
    margin-bottom: 10px;
  }
`;

export const KeyResultItemContainer = styled.div.attrs({
  'data-cy': 'key-result-item',
})`
  padding: 25px;
  background-color: #f4f6fa;
`;
