import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import moment from 'moment';

import { i18n } from 'utilities/decorators';
import { Calendar } from 'Components/Common';
import { startTimeIcon, endTimeIcon } from 'images/icons/common';

export const Container = styled.div`
  display: flex;
  flex-flow: row;
  justify-content: space-between;
  width: 586px;
  background: #ffffff;
  
  @media screen and (max-width: 1024px) {
    flex-flow: column;
    width: 268px;
    margin: 0 auto;
  }
 `;

const Separator = styled.div`
  width: 11px;
  margin: 13px 13px 13px 26px;
  border-left: 1px solid #c9d0db;

  @media screen and (max-width: 1024px) {
    height: 11px;
    width: calc(100% - 26px);
    margin: 26px 13px 13px 13px;
    border-top: 1px solid #c9d0db;
    border-left: none;
  }
`;

export class DateRangePicker extends React.PureComponent {
  static propTypes = {
    // NOTE: value is an array of moment
    value: PropTypes.arrayOf(PropTypes.object),
    initialMonth: PropTypes.any,
    minDate: PropTypes.object,
    maxDate: PropTypes.object,
    onChange: PropTypes.func,
  };

  static defaultProps = {
    value: [],
  };

  state = {
    initialStartMonth: moment(),
    initialEndMonth: moment().add(1, 'month'),
    currentStartMonth: null,
    currentEndMonth: null,
  };

  componentDidMount() {
    const { value, initialMonth } = this.props;

    if (initialMonth) {
      this.setState({
        initialStartMonth: moment(initialMonth),
        initialEndMonth: moment(initialMonth).add(1, 'month'),
      });
      return;
    }
    if (value[0]) {
      this.setState({
        initialStartMonth: moment(value[0]),
      });
    }
    if (value[1]) {
      this.setState({
        initialEndMonth: moment(value[1]),
      });
    }
  }

  componentDidUpdate(prevProps) {
    const { value, initialMonth } = this.props;
    if (initialMonth && initialMonth !== prevProps.initialMonth) {
      this.setState({
        initialStartMonth: moment(initialMonth),
        initialEndMonth: moment(initialMonth).add(1, 'month'),

      });
      return;
    }

    if (!prevProps.value && value) {
      if (value[0]) {
        this.setState({
          initialStartMonth: moment(value[0]),
        });
      }
      if (value[1]) {
        this.setState({
          initialEndMonth: moment(value[1]),
        });
      }
    }
  }

  handleSelect = (date) => {
    const { value, onChange } = this.props;
    const ret = [];
    if (!value || !value.length || !value.some(e => !e)) {
      ret.push(date, null);
    } else {
      const dates = [date, ...value.filter(e => e)];
      ret.push(moment.min(dates).startOf('day'), moment.max(dates).endOf('day'));
    }
    onChange && onChange(ret);
  };

  handleChangeStartMonth = (date) => {
    const { currentEndMonth, initialStartMonth } = this.state;
    this.setState(() => {
      if (date.isSameOrAfter(currentEndMonth || initialStartMonth)) {
        return {
          currentStartMonth: moment(date),
          currentEndMonth: moment(date).add(1, 'month'),
          initialEndMonth: moment(date).add(1, 'month'),
        };
      }
      return { currentStartMonth: date };
    });
  };

  handleChangeEndMonth = (date) => {
    const { currentStartMonth, initialEndMonth } = this.state;
    this.setState(() => {
      if (date.isSameOrBefore(currentStartMonth || initialEndMonth)) {
        return {
          currentStartMonth: moment(date).subtract(1, 'month'),
          currentEndMonth: moment(date),
          initialStartMonth: moment(date).subtract(1, 'month') };
      }
      return { currentEndMonth: date };
    });
  };


  render() {
    const { value, minDate, maxDate } = this.props;
    const { initialStartMonth, initialEndMonth } = this.state;

    return (
      <Container>
        <Calendar
          value={value}
          selectRange
          noUpdateMonth
          minDate={minDate}
          maxDate={maxDate}
          initialMonth={initialStartMonth}
          labelIcon={startTimeIcon}
          labelText={i18n.global('CommonComponents.DateRangePicker.Labels.StartDate')}
          onSelect={this.handleSelect}
          onChangeMonth={this.handleChangeStartMonth}
        />
        <Separator />
        <Calendar
          value={value}
          selectRange
          noUpdateMonth
          minDate={minDate}
          maxDate={maxDate}
          initialMonth={initialEndMonth}
          labelIcon={endTimeIcon}
          labelText={i18n.global('CommonComponents.DateRangePicker.Labels.EndDate')}
          onSelect={this.handleSelect}
          onChangeMonth={this.handleChangeEndMonth}
        />
      </Container>
    );
  }
}
