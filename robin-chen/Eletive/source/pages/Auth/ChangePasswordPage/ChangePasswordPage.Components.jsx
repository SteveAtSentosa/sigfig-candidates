import styled from 'styled-components';
import { Link } from 'react-router-dom';

import { eletiveLogo } from 'images';

export const ChangePasswordFormWrapper = styled.div`
  max-width: 400px;
  width: 100%;
`;

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
  flex-direction: column;
  width: 30%;
  padding: 20px;
  background-color: rgba(255, 255, 255, 0.95);

  @media screen and (max-width: 1024px) {
    width: 100%;
    max-width: 100%;
  }
`;

export const Logo = styled.i.attrs({
  dangerouslySetInnerHTML: { __html: eletiveLogo },
})`
  display: block;
  width: 100%;
  max-width: 250px;
  margin: 0 auto;
  margin-top: -160px;
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

export const SigninPageLink = styled(Link)`
  color: #5c7080;

  &:hover {
    color: #5c7080;
  }
`;
