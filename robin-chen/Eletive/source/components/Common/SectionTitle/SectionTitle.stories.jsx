import React from 'react';

import { SectionTitle } from 'Components/Common';

export default {
  title: 'Common|SectionTitle',

  parameters: {
    component: SectionTitle,
    componentSubtitle: 'Section title',
  },
};

export const normal = () => (
  <SectionTitle title="Test title" />
);
