import React from 'react';

import { Accordion } from './Accordion';

export default {
  title: 'Common|Accordion',
  parameters: {
    component: Accordion,
    componentSubtitle: '',
  },
};

const props = {
  items: [
    {
      key: 'date-range',
      value: 'Date Range',
    },
    {
      key: 'reply',
      value: 'Reply',
    },
    {
      key: 'read',
      value: 'Read',
    },
    {
      key: 'acknowledge',
      value: 'Acknowledge',
    },
    {
      key: 'labels',
      value: 'Labels',
    },
  ],
  itemRenderer: type => type,
};

export const normal = () => (
  <Accordion {...props} />
);
