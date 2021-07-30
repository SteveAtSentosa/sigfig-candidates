import React from 'react';

import { Label } from 'Components/Common';

export default {
  title: 'Common|Label',
  parameters: {
    component: Label,
    componentSubtitle: '',
  },
};

const props = {
  label: 'Label text',
};

export const normal = () => (
  <Label {...props} />
);

export const required = () => (
  <Label required {...props} />
);

export const helpTooltip = () => (
  <Label {...props} helpTooltip="Help tooltip text" />
);


export const inline = () => (
  <Label inline {...props} />
);
