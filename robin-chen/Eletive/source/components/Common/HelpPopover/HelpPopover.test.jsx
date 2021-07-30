import React from 'react';
import { shallow } from 'enzyme';

import { HelpPopover } from './HelpPopover';

describe('HelpPopover', () => {
  it('is defined', () => {
    const component = shallow(
      <HelpPopover
        content={<div>Popover Content</div>}
        position="bottom"
      >
        {
          <div>Popover Here</div>
        }
      </HelpPopover>,
    );
    expect(component).toBeDefined();
  });
});
