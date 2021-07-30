import React from 'react';
import PropTypes from 'prop-types';
import * as moment from 'moment-timezone';

import {
  clockIcon,
} from 'images/icons/common';

import { getLocalTimezoneItem, convertTimezone } from 'utilities/timezone';

import { SingleSelect } from 'Components/Common';

import * as Own from './TimezonePicker.Components';

class TimezonePicker extends React.PureComponent {
  static propTypes = {
    value: PropTypes.shape({
      abbreviation: PropTypes.string,
      offset: PropTypes.number,
      offsetAsString: PropTypes.string,
      timezone: PropTypes.string,
      key: PropTypes.string,
      text: PropTypes.string,
      iconName: PropTypes.string,
    }),
    onChange: PropTypes.func,
  }

  constructor(props) {
    super(props);
    const timestamp = Date.now();
    const containSlash = /\//;
    const etcTimezone = /Etc\//;
    const timezoneItems = moment.tz
      .names()
      .filter(timezone => containSlash.test(timezone) && !etcTimezone.test(timezone))
      .map(timezone => convertTimezone(timezone, timestamp))
      .sort((a, b) => a.offset - b.offset);
    const localTimezone = getLocalTimezoneItem();
    this.timezoneItems = localTimezone ? [localTimezone, ...timezoneItems] : timezoneItems;
  }

  handleSelect = (item) => {
    const { onChange } = this.props;
    onChange && onChange(item);
  }

  labelRenderer = () => (
    <Own.Label>
      <Own.ClockIcon source={clockIcon} />
    </Own.Label>
  );

  itemFilter = (item, filterValue) => `${item.text}${item.offsetAsString}`.toLowerCase()
    .includes(filterValue.toLowerCase());

  itemRenderer = item => (
    <Own.TimezoneItem>
      <span>{item.text}</span>
      <span>{item.offsetAsString}</span>
    </Own.TimezoneItem>
  );

  render() {
    const { value } = this.props;

    return (
      <Own.Container>
        <SingleSelect
          items={this.timezoneItems}
          activeItem={value}
          filterable
          labelRenderer={this.labelRenderer}
          itemRenderer={this.itemRenderer}
          itemFilter={this.itemFilter}
          onItemSelect={this.handleSelect}
        />
      </Own.Container>
    );
  }
}

export { TimezonePicker };
