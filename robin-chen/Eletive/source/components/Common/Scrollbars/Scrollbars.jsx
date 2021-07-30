import React from 'react';

import * as Own from './Scrollbars.Components';

export const Scrollbars = ({ children, ...props }) => (
  <Own.ScrollbarContainer {...props} noDefaultStyles>
    {children}
  </Own.ScrollbarContainer>
);

Scrollbars.props = {
  rightY: 10,
};
