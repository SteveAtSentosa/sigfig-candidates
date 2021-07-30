import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import { leftChevronIcon, rightChevronIcon } from 'images/icons/common';

import * as OwnComponents from './Calendar.Components';
import { InlineButton } from '../InlineButton/InlineButton';

export class Calendar extends React.PureComponent {
  static propTypes = {
    // NOTE: value is an array of moment
    value: PropTypes.arrayOf(PropTypes.object),
    selectRange: PropTypes.bool,
    noUpdateMonth: PropTypes.bool,
    initialMonth: PropTypes.any,
    minDate: PropTypes.object,
    maxDate: PropTypes.object,
    labelIcon: PropTypes.node,
    labelText: PropTypes.string,
    onSelect: PropTypes.func,
    onChangeMonth: PropTypes.func,
  };

  static defaultProps = {
    value: [],
    selectRange: false,
    noUpdateMonth: false,
    minDate: null,
  };

  constructor(props) {
    super(props);
    const { initialMonth } = props;
    this.weekdayshort = moment.weekdaysShort(true);
    this.state = {
      dateObject: moment(initialMonth || moment()).startOf('month'),
    };
  }

  componentDidMount() {
    const { value, initialMonth, noUpdateMonth } = this.props;
    const { dateObject } = this.state;
    if (noUpdateMonth) {
      return;
    }
    if (!moment(dateObject).isSame(initialMonth, 'month')) {
      this.setState({
        dateObject: moment(initialMonth).startOf('month'),
      });
      return;
    }
    if (value[0] && !dateObject.isSame(value[0], 'month') && !dateObject.isSame(value[1], 'month')) {
      this.setState({
        dateObject: moment(value[0]).startOf('month'),
      });
    }
  }

  componentDidUpdate(prevProps) {
    const { value, initialMonth, noUpdateMonth } = this.props;
    const { dateObject } = this.state;
    if (prevProps.initialMonth !== initialMonth &&
      !moment(dateObject).isSame(initialMonth, 'month')
    ) {
      this.setState({
        dateObject: moment(initialMonth).startOf('month'),
      });
      return;
    }
    if (noUpdateMonth) {
      return;
    }
    if (prevProps.value !== value) {
      if (value[0] && !dateObject.isSame(value[0], 'month') && !dateObject.isSame(value[1], 'month')) {
        this.setState({
          dateObject: moment(value[0]).startOf('month'),
        });
      }
    }
  }

  get daysInMonth() {
    const { dateObject } = this.state;
    return [...Array(dateObject.daysInMonth())].map((a, i) => i + 1);
  }

  get year() {
    const { dateObject } = this.state;
    return dateObject.format('Y');
  }

  get month() {
    const { dateObject } = this.state;
    return dateObject.format('MMMM');
  }

  getDaysOfPreviousMonth() {
    const { dateObject } = this.state;
    const previousMonth = moment(dateObject).subtract(1, 'day');
    const weekDay = previousMonth.weekday();
    if (weekDay === 6) {
      return [];
    }
    const day = previousMonth.date();
    return [...Array(weekDay + 1)].map((e, i) => day - weekDay + i);
  }

  getDaysOfNextMonth() {
    const { dateObject } = this.state;
    const nextMonth = moment(dateObject).add(1, 'month');
    const weekDay = nextMonth.weekday();
    return [...Array(7 - weekDay)].map((e, i) => i + 1);
  }

  getDayAttributes(day, isLastDayOfMonth = false) {
    const { value, selectRange, minDate, maxDate } = this.props;
    const { dateObject } = this.state;
    const date = moment(dateObject).date(day);
    const ret = {};
    if ((minDate && date.isBefore(minDate, 'day')) ||
      (maxDate && date.isAfter(maxDate, 'day'))
    ) {
      ret.blank = true;
    }
    if (selectRange && !value.some(e => !e)) {
      const [start, end] = value;
      if (date.isSame(start, 'day')) {
        ret.selected = true;
        if (!isLastDayOfMonth) {
          ret.startRange = true;
        }
      } else if (date.isSame(end, 'day')) {
        ret.selected = true;
        if (day !== 1) {
          ret.endRange = true;
        }
      } else if (date.isBetween(start, end)) {
        if (day === 1) {
          ret.firstDay = true;
        } else if (isLastDayOfMonth) {
          ret.lastDay = true;
        } else {
          ret.range = true;
        }
      }
    } else if (value.some(v => date.isSame(v, 'day'))) {
      ret.selected = true;
    }
    return ret;
  }

  setCurrentMonth = (date) => {
    const { onChangeMonth } = this.props;
    const { dateObject: oldDateObject } = this.state;
    const dateObject = moment(date).startOf('month');
    if (dateObject.isSame(oldDateObject, 'day')) {
      return;
    }
    this.setState({
      dateObject,
    });
    onChangeMonth && onChangeMonth(dateObject);
  };

  handleDayClick = (e, day) => {
    const { onSelect } = this.props;
    const { dateObject } = this.state;
    const date = moment(dateObject).date(day);
    onSelect && onSelect(date);
  };

  handlePrevious = () => {
    const { dateObject } = this.state;
    this.setCurrentMonth(moment(dateObject).subtract(1, 'month'));
  };

  handleNext = () => {
    const { dateObject } = this.state;
    this.setCurrentMonth(moment(dateObject).add(1, 'month'));
  };

  renderDays() {
    let days = this.daysInMonth;
    days = days.map((day, i) => {
      const attributes = this.getDayAttributes(day, i === days.length - 1);
      return (
        <OwnComponents.Day
          key={day}
          onClick={e => !attributes.blank && this.handleDayClick(e, day)}
          {...attributes}
        >
          {day}
        </OwnComponents.Day>);
    });

    const totalSlots = [
      ...this.getDaysOfPreviousMonth().map(e => <OwnComponents.Day key={`b${e}`} blank>{e}</OwnComponents.Day>),
      ...days,
      ...this.getDaysOfNextMonth().map(e => <OwnComponents.Day key={`b${e}`} blank>{e}</OwnComponents.Day>),
    ];
    const rows = [];
    let cells = [];

    totalSlots.forEach((row, i) => {
      if (i % 7 !== 0) {
        cells.push(row);
      } else {
        if (cells.length) {
          rows.push(cells);
        }
        cells = [];
        cells.push(row);
      }
      if (i === totalSlots.length - 1) {
        rows.push(cells);
      }
    });
    return rows.map((d, i) => <OwnComponents.Row key={i}>{d}</OwnComponents.Row>);
  }

  render() {
    const { labelIcon, labelText } = this.props;
    return (
      <OwnComponents.Container>
        {(labelIcon || labelText) &&
        <OwnComponents.LabelContainer>
          {labelIcon &&
          typeof labelIcon === 'string' ? <OwnComponents.LabelIcon source={labelIcon} /> : labelIcon
          }
          {labelText &&
          <OwnComponents.LabelText>{labelText}</OwnComponents.LabelText>
          }
        </OwnComponents.LabelContainer>
        }
        <OwnComponents.CalendarNavigation>
          <InlineButton onClick={this.handlePrevious} icon={leftChevronIcon} />
          <OwnComponents.NavigationLabel>{this.month} {this.year}</OwnComponents.NavigationLabel>
          <InlineButton onClick={this.handleNext} icon={rightChevronIcon} />
        </OwnComponents.CalendarNavigation>
        <OwnComponents.WeekdaysLabel>
          {this.weekdayshort.map(day => (
            <div key={day}>{day}</div>
          ))}
        </OwnComponents.WeekdaysLabel>
        <OwnComponents.DayContainer>
          {this.renderDays()}
        </OwnComponents.DayContainer>

      </OwnComponents.Container>
    );
  }
}
