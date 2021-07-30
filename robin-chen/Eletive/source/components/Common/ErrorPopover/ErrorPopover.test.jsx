import React from 'react';
import { shallow } from 'enzyme';

import { ErrorPopover } from './ErrorPopover';

describe('HelpPopover', () => {
  it('is defined', () => {
    const component = shallow(
      <ErrorPopover
        content={<div>Popover Content</div>}
        position="right"
      >
        <div>Popover Here</div>
      </ErrorPopover>,
    );
    expect(component).toBeDefined();
  });
});
