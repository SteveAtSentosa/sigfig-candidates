import React from 'react';

import { TargetPopover } from 'Components/Common';

export default {
  title: 'Common|TargetPopover',
  parameters: {
    component: TargetPopover,
    componentSubtitle: `Base component for create popup element showing by target click.
 Have 2 types of popup containers`,
  },
};

const props = {
  contentRenderer: ({ closePopup }) => (
    <div>
      <button type="button" onClick={closePopup}>close</button>
    </div>
  ),
};

export const normal = () => (
  <TargetPopover {...props}>
    <button type="button">show</button>
  </TargetPopover>
);

export const withArrow = () => (
  <TargetPopover {...props} withArrow>
    <button type="button">show</button>
  </TargetPopover>
);
