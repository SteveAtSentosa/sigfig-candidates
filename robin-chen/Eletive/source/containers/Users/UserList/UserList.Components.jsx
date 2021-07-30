import styled from 'styled-components';
import { exclamationCircleIcon } from 'images/icons/common';
import { SvgImage } from 'Components/Common';

export const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 12px;
  margin-bottom: 24px;
`;

export const HeaderTitle = styled.div`
  color: #244986;
  font-size: 14px;
  font-weight: 600;
  line-height: 21px;
  letter-spacing: .05em;
  width: 100%;
`;

export const SearchInputWrapper = styled.div`
  width: 70%;
  margin-left: 25px;
`;

export const FilterWrapper = styled.div`
  display: flex;
  align-items: center;
  width: 70%;
`;

export const FilterText = styled.div`
  font-size: 12px;
  font-weight: 600;
  line-height: 21px;
  letter-spacing: .05em;
  color: #707e93;
  margin-right: 16px;
  align-items: center;
`;

export const CheckboxWrapper = styled.div`
  width: 22px;
  height: 22px;
`;

export const RowUserAvatarContainer = styled.div`
  flex-shrink: 0;

  ${CheckboxWrapper} {
    margin: 9px;
  }

  ${props => props.isChecked && `
    ${CheckboxWrapper} {
      display: block ! important;
    }
  `}

  ${props => !props.isChecked && `
    ${CheckboxWrapper} {
      display: none;
      background-color: white;
    }
  `}
`;

export const NameContainer = styled.div`
  margin-left: 16px;
  color: #707e93;
`;

export const Email = styled.div`
  display: flex;
  color: #98a6bc;
  font-size: 10px;
  font-weight: 400;
`;

export const MobileUser = styled.div`
  display: flex;
  align-items: center;
`;

export const UserTableContainer = styled.div`
  > div:hover {
      background-color: rgba(92,112,128,0.01);

      ${RowUserAvatarContainer} {
          > div {
            display: none;
          }

          ${CheckboxWrapper} {
            display: block;
          }
      }
  }
`;

export const BouncedInformation = styled(SvgImage).attrs({
  source: exclamationCircleIcon,
})`
  width: 16px;
  height: 16px;
  color: #ffad9d;
`;
