import React from 'react';

import { Breadcrumbs } from 'Components/Common';

export default {
  title: 'Common|Breadcrumbs',
  parameters: {
    component: Breadcrumbs,
  },
};

const crumbs = [
  { name: 'start', route: '/start' },
  { name: 'sub page', route: '/start/sub-page' },
];

export const normal = () => (
  <Breadcrumbs items={crumbs} />
);
