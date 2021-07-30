import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { Icon, Classes } from '@blueprintjs/core';

import { eletiveLogo } from 'images';

export const Container = styled.div`
  display: flex;
  height: 100%;
  background-image: url('../../../images/auth-background.jpg');
  background-size: cover;
  background-position: center;
`;

export const FormContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30%;
  padding: 20px;
  background-color: rgba(255, 255, 255, 0.95);

  @media screen and (max-width: 1024px) {
    width: 100%;
    max-width: 100%;
  }
`;

export const Form = styled.div`
  margin-top: -160px;
  width: 100%;
  max-width: 400px;

  @media screen and (max-width: 768px) {
    margin-top: -60px;
  }
`;

export const EletiveLogo = styled.i.attrs({
  dangerouslySetInnerHTML: { __html: eletiveLogo },
})`
  display: block;
  max-width: 250px;
  margin: 0 auto;
`;

export const Title = styled.h1`
  margin-top: 100px;
  color: #333;
  text-align: center;
`;

export const LinkContainer = styled.div`
  margin-top: 10px;
  text-align: center;
`;

export const ForgotPasswordLink = styled(Link)`
  color: #5c7080;

  &:hover {
    color: #5c7080;
  }
`;

export const PasswordIcon = styled(Icon)`
  margin-right: 10px;
`;

export const PasswordLabel = styled.div.attrs({
  className: Classes.TEXT_MUTED,
})`
  display: flex;
  justify-content: space-between;
`;

export const ErrorMessage = styled.div`
  color: #bf2002;
`;

export const AuthTokenErrorMessage = styled(ErrorMessage)`
  text-align: center;
`;

export const AuthTokenInputLabel = styled.p.attrs({
  className: Classes.TEXT_MUTED,
})`
  text-align: center;
`;

export const AuthTokenInputContainer = styled.div`
  margin-bottom: 20px;
`;

export const TogglePasswordVisibilityButton = styled.button.attrs({
  type: 'button',
  tabIndex: -1,
})`
  display: flex;
  padding: 0;
  border: 0;
  background: transparent;
  color: inherit;
  cursor: pointer;
`;
