import styled from 'styled-components';
import { SvgImage } from 'Components/Common';
import { eyeClosedIcon, eyeOpenIcon } from 'images/icons/common';

export const Container = styled.form`
  width: 100%;
`;

export const CurrentPasswordContainer = styled.div`
  margin-bottom: 30px;
`;

export const PasswordLabel = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

export const TogglePasswordVisibilityButton = styled.button.attrs({
  type: 'button',
  tabIndex: -1,
})`
  display: flex;
  align-items: center;
  padding: 0;
  border: 0;
  background: transparent;
  color: inherit;
  cursor: pointer;
`;

export const PasswordRateMeterContainer = styled.div`
  margin-top: 15px;
  margin-bottom: 25px;
`;

const PasswordIcon = styled(SvgImage)`
  width: 15px;
  margin-right: 5px;
`;

export const EyeClosedIcon = styled(PasswordIcon).attrs({
  source: eyeClosedIcon,
})`
  color: #707e93;
`;

export const EyeOpenIcon = styled(PasswordIcon).attrs({
  source: eyeOpenIcon,
})`
  color: #98a6bc;
`;
