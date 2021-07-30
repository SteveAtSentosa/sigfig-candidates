import React from 'react';

import { SubSectionTitle } from 'Components/Common';

export default {
  title: 'Common|SubSectionTitle',

  parameters: {
    component: SubSectionTitle,
    componentSubtitle: 'Sub section title',
  },
};

export const normal = () => (
  <SubSectionTitle title="Test title" />
);
