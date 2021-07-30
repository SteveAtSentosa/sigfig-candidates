import React from 'react';
import PropTypes from 'prop-types';

import { Currencies } from 'Constants/index';
import { SingleSelect as Select } from 'Components/Common';

class CurrencySelect extends React.PureComponent {
  static propTypes={
    onSelect: PropTypes.func,
    activeItem: PropTypes.string,
  };

  itemRenderer = ({ currency, unit }) => `${currency} (${unit})`;

  onItemSelect = ({ currency }) => {
    const { onSelect } = this.props;
    onSelect(currency);
  };

  render() {
    const { activeItem } = this.props;
    return (
      <Select
        items={Currencies}
        onItemSelect={this.onItemSelect}
        activeItem={Currencies.find(({ currency }) => currency === activeItem)}
        itemRenderer={this.itemRenderer}
      />
    );
  }
}

export { CurrencySelect };
