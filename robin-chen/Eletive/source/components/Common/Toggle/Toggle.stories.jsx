import React from 'react';
import { action } from '@storybook/addon-actions';

import { Toggle } from './Toggle';

export default {
  title: 'Common|Toggle',

  parameters: {
    component: Toggle,
    componentSubtitle: '',
  },
};

class DefaultToggle extends React.PureComponent {
  constructor() {
    super();
    this.state = { checked: false };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange = (checked) => {
    action('onChange')(checked);
    this.setState({ checked });
  }

  render() {
    const { checked } = this.state;
    return (
      <Toggle
        onChange={this.handleChange}
        checked={checked}
      />
    );
  }
}
export const normal = () => (
  <DefaultToggle />
);
