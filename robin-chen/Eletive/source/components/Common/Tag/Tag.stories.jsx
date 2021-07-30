import React from 'react';

import { Tag } from 'Components/Common';

export default {
  title: 'Common|Tag',
  parameters: {
    component: Tag,
    componentSubtitle: 'Tag component',
  },
};

const props = {
  label: 'Tag component',
};

export const normal = () => (
  <Tag {...props} />
);
