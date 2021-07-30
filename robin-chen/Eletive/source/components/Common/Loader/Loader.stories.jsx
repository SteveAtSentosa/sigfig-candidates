import React from 'react';
import { Loader } from './Loader';

export default {
  title: 'Common|Loader',
  parameters: {
    component: Loader,
  },
};

export const normal = () => (
  <div style={{ height: '100vh' }}>
    <Loader />
  </div>
);
