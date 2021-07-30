import React from 'react';

import { HelpPopover } from './HelpPopover';

export default {
  title: 'Common|HelpPopover',

  parameters: {
    component: HelpPopover,
    componentSubtitle: 'Tooltip popover',
  },
};

const props = {
  content: <div>Popover Content</div>,
  position: 'bottom',
};

export const normal = () => (
  <HelpPopover {...props}>
    <div>Popover Here</div>
  </HelpPopover>
);
