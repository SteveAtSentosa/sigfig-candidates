import React from 'react';
import { shallow } from 'enzyme';

import { Expandable } from './Expandable';

describe('Expandable', () => {
  it('is defined', () => {
    const component = shallow(
      <Expandable
        header={<div>Expandable Header</div>}
        expanded
      >
        <div>Expandable Content</div>
      </Expandable>,
    );
    expect(component).toBeDefined();
  });
});
