import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import { DateRangeSelect, FormGroup, SingleSelect as Select, PopoverPosition } from 'Components/Common';
import * as OwnComponents from './ObjectiveDate.Components';
import { getQuarters, quarterRange } from './ObjectiveDate.service';

export class ObjectiveDate extends React.PureComponent {
  static propTypes = {
    label: PropTypes.string,
    required: PropTypes.bool,
    value: PropTypes.arrayOf(PropTypes.object).isRequired,
    onChange: PropTypes.func.isRequired,
    dateRangePosition: PropTypes.string,
    isFullWidth: PropTypes.bool,
  };

  static defaultProps = {
    dateRangePosition: PopoverPosition.BOTTOM,
  };

  quarters = [
    {
      title: 'Custom dates',
      id: 0,
    },
    ...getQuarters(),
  ];

  constructor(props) {
    super(props);
    const { value } = props;

    this.state = {
      currentQuarter: quarterRange(moment(value[0]), moment(value[1])),
    };
  }

  componentDidMount() {
    const { value } = this.props;
    if (value) {
      this.setState({ currentQuarter: quarterRange(moment(value[0]), moment(value[1])) });
    }
  }

  componentDidUpdate(prevProps) {
    const { value } = this.props;
    if (prevProps.value !== value || prevProps.value[0] !== value[0] || prevProps.value[0] !== value[0]) {
      const currentQuarter = (value[1] && quarterRange(value[0], value[1])) || this.quarters[0];
      this.setState({ currentQuarter });
    }
  }

  handleChangeQuarter = (quarter) => {
    const { onChange } = this.props;
    const { id, startDate, endDate } = quarter;

    if (id) {
      onChange([startDate, endDate]);
    }
    this.setState({ currentQuarter: quarter });
  };

  render() {
    const { label, required, value, onChange, dateRangePosition, isFullWidth } = this.props;
    const { currentQuarter } = this.state;
    const leftDateWrapperWidth = isFullWidth ? '33%' : undefined;
    const rightDateWrapperWidth = isFullWidth ? '67%' : undefined;

    return (
      <FormGroup label={label} required={required}>
        <OwnComponents.DatePickerWrapper>
          <OwnComponents.DateWrapper width={leftDateWrapperWidth}>
            <Select
              items={this.quarters}
              onItemSelect={this.handleChangeQuarter}
              activeItem={currentQuarter}
            />
          </OwnComponents.DateWrapper>
          <OwnComponents.DateWrapper width={rightDateWrapperWidth}>
            <DateRangeSelect
              value={value}
              onChange={onChange}
              position={dateRangePosition}
            />
          </OwnComponents.DateWrapper>
        </OwnComponents.DatePickerWrapper>
      </FormGroup>
    );
  }
}
