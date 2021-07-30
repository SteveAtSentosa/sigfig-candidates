import React from 'react';
import { shallow } from 'enzyme';

import { NoData } from './NoData';

describe('NoData component', () => {
  it('adds custom class name passed', () => {
    const component = shallow(
      <NoData className="custom-class" />,
    );

    expect(component.hasClass('custom-class')).toBeTruthy();
  });

  it('render it\'s content with BlueprintJS muted style', () => {
    const component = shallow(
      <NoData />,
    );

    expect(component.hasClass('bp3-text-muted')).toBeTruthy();
  });
});
