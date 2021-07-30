import React from 'react';
import styled from 'styled-components';

import { Card } from './Card';

export default {
  title: 'Common|Card',
  parameters: {
    component: Card,
  },
};

const Content = styled.div`
  height: 300px;
`;

export const normal = () => (
  <Card><Content /></Card>
);

export const withHeader = () => (
  <Card headerText="Sample Header" showHeader><Content /></Card>
);
