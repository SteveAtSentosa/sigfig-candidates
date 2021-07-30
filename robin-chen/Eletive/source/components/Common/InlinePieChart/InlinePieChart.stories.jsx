import React from 'react';

import { InlinePieChart } from './InlinePieChart';

export default {
  title: 'Common|InlinePieChart',

  parameters: {
    component: InlinePieChart,
    componentSubtitle: '',
  },
};

const props = {
  diameter: 20,
  strokeWidth: 3,
  color: '#4489fb',
  percentage: 0.75,
};

export const normal = () => (
  <InlinePieChart {...props} />
);
