import styled from 'styled-components';
import { searchIcon, closeDaggerIcon } from 'images/icons/common';
import { CardButton, InlineButton, SvgImage } from 'Components/Common';

export const TargetButton = styled(CardButton)`
  width: auto;
  min-width: 228px;
  height: 36px;
  padding: 3px 12px;
  white-space: nowrap;

  ${props => props.fillContainer && `
    width: 100%;
  `}

  @media screen and (max-width: 1024px) {
    ${props => !props.fillContainer && `
      width: 228px;
    `}
  }
`;

export const TargetButtonContent = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  min-width: 0;
`;

export const TargetIcon = styled(SvgImage)`
  flex-shrink: 0;
  width: 16px;
  min-width: 16px;
  height: 16px;
  margin-right: 5px;
`;

export const TargetButtonText = styled.div`
  font-size: 12px;
  color: #707e93;
  margin-right: 4px;
  text-align: left;
  text-overflow: ellipsis;
  overflow: hidden;
`;

export const TargetButtonAttributeName = styled.div`
  font-weight: 500;
  font-size: 12px;
  color: white !important;
  background-color: #66d587 !important;
  padding: 3px 7px;
  border-radius: 2px;
`;

export const TargetButtonChevron = styled(SvgImage)`
  margin-left: 5px;
  width: 10px;
  height: 10px;

  ${props => props.open && `
    transform: rotateZ(180deg);
  `}
`;

export const PopupContent = styled.div`
  flex: 1;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
`;

export const PopupHeader = styled.div`
  padding: 5px 5px 8px 5px;
`;

export const PopupSearchContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  height: 30px;

  input {
    padding-left: 35px;
    padding-right: 24px;
    font-size: 10px;
  }
`;

export const SearchIcon = styled(SvgImage).attrs({
  source: searchIcon,
})`
  position: absolute;
  top: 9px;
  left: 16px;
  width: 12px;
  height: 12px;
  color: #98a6bc;
`;

export const ClearButton = styled(InlineButton).attrs({
  icon: closeDaggerIcon,
})`
  position: absolute;
  top: 0;
  right: 4px;
  color: #98a6bc;
  cursor: pointer;

  i {
    width: 8px;
    height: 8px;
  }
`;

export const PopupFooter = styled.div`
  display: flex;
  align-items: center;
  padding: 0 12px;
  height: 36px;
  margin-top: 2px;
  border-radius: 0 0 7px 7px;
  background: #f4f6fa;
`;

export const PopupContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 375px;
  min-height: 300px;
  overflow: hidden;
  background: #ffffff;
  box-shadow: 0px 3.24219px 16.2109px rgba(36, 73, 134, 0.15);
  border-radius: 6.48438px;
  letter-spacing: .1em;
  transition: opacity .3s ease-in-out;
  ${props => !props.isOpen && `
    opacity: 0;
  `}

  @media screen and (max-width: 768px) {
    display: flex;
    flex-direction: column;
    width: calc(100vw - 50px);

    ${PopupFooter} {
      margin-top: auto;
    }

    ${PopupContent} {
      flex-basis: 100%;
    }
  }
`;

export const CancelButton = styled(InlineButton)`
  color: #707e93;
  font-weight: 500;
  font-size: 10px;
  cursor: pointer;

  &:hover {
    opacity: .7;
  }
`;

export const DeselectAllButton = styled(InlineButton)`
  color: #707e93;
  font-weight: 500;
  font-size: 10px;
  cursor: pointer;

  &:hover {
    opacity: .7;
  }
`;

export const SelectAllButton = styled.button.attrs({ type: 'button' })`
  height: 22px;
  padding: 5px;
  background-color: #66d587;
  color: #ffffff;
  font-weight: 500;
  font-size: 9px;
  border-radius: 2px;
  border: none;
  cursor: pointer;

  &:hover {
    opacity: .7;
  }
`;
