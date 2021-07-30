import React from 'react';
import { shallow } from 'enzyme';

import { InlineButton, ListBlock } from 'Components/Common';
import { addIcon } from 'images/icons/common';

describe('ListBlock', () => {
  it('is defined', () => {
    const component = shallow(
      <ListBlock
        label="Talking Points"
        required
        emptyText="There is nothing here"
        emptyAction={<InlineButton text="Create 1-on-1" icon={addIcon} />}
        headerAction={<InlineButton text="Add from template" icon={addIcon} />}
      />,
    );
    expect(component).toBeDefined();
  });
});
