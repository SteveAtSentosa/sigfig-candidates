import React from 'react';

import { Expandable } from './Expandable';

export default {
  title: 'Common|Expandable',

  parameters: {
    component: Expandable,
    componentSubtitle: 'Expandable',
  },
};

const props = {
  header: <div>Expandable Header</div>,
  expanded: false,
};

export const normal = () => (
  <Expandable {...props}>
    <div>Expandable Content</div>
  </Expandable>
);

const expandedProps = {
  header: <div>Expandable Header</div>,
  expanded: true,
};

export const expanded = () => (
  <Expandable {...expandedProps}>
    <div>Expandable Content</div>
  </Expandable>
);
