import React from 'react';
import styled from 'styled-components';
import { NameAbbreviation } from 'Components/Common';

const Avatar = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  border-radius: 5px;
  color: #ffffff;
  background: linear-gradient(90deg, #97a7ff 0%, #6774e3 100%);
  font-weight: 600;
  font-size: 12px;
  line-height: 18px;

  ${props => props.small && `
    width: 30px;
    height: 30px;
    font-size: 9px;
    line-height: 13px;
  `}

  ${props => props.anonym && `
    background: #c9d0db;
    font-size: 16px;
  `}

  ${props => props.gray && `
    background: #c9d0db;
  `}
`;

export const UserAvatar = ({ user, small, anonym, gray }) => (
  <Avatar small={small} anonym={anonym} gray={gray}>
    {anonym || !user ? '?' : <NameAbbreviation>{`${user?.firstName} ${user?.lastName}`}</NameAbbreviation>}
  </Avatar>
);
