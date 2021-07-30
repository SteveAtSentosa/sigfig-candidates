import React from 'react';
import { shallow } from 'enzyme';

import { ActionMenu } from 'Components/Common';
import { editIcon, searchIcon } from 'images/icons/common';


describe('ActionMenu', () => {
  it('is defined', () => {
    const items = [{
      title: 'Edit',
      icon: editIcon,
      onClick: () => {},
    }, {
      title: 'Search',
      icon: searchIcon,
    }];

    const component = shallow(
      <ActionMenu popoverProps={{ position: 'bottom', align: 'end' }} items={items} />,
    );
    expect(component).toBeDefined();
  });
});
