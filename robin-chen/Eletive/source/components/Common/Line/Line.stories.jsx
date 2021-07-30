import React from 'react';

import { Line } from 'Components/Common';

export default {
  title: 'Common|Line',

  parameters: {
    component: Line,
    componentSubtitle: 'A simple line to draw as a divider between elements, or an underline for an element',
  },
};

export const normal = () => (
  <>
    <p>Between this paragraph...</p>
    <Line marginTop={30} marginBottom={15} />
    <p>
      and this paragraph there is a Line, with a top margin of 30px, bottom margin of 15px.<br />
      These dividing lines are used quite a lot throughout the design.
    </p>
  </>
);
