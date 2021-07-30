import React from 'react';
import { shallow } from 'enzyme';
import 'jest-styled-components';

import { Line } from 'Components/Common';

describe('Line', () => {
  it('renders line with default 0 top and bottom margins', () => {
    const component = shallow(
      <Line />,
    );
    expect(component).toHaveStyleRule('margin-top', '0px');
    expect(component).toHaveStyleRule('margin-bottom', '0px');
  });

  it('renders line with specific top and bottom margins', () => {
    const component = shallow(
      <Line marginTop={10} marginBottom={55} />,
    );
    expect(component).toHaveStyleRule('margin-top', '10px');
    expect(component).toHaveStyleRule('margin-bottom', '55px');
  });

  it('renders line with correct background color', () => {
    const component = shallow(
      <Line />,
    );
    expect(component).toHaveStyleRule('background-color', '#c9d0db');
  });
});
