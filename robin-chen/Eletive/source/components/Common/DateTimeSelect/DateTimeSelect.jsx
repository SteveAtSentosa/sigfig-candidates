import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Scrollbars } from 'react-custom-scrollbars';

import {
  SvgImage,
  Calendar,
  CardButton,
  FormButton,
  InlineButton,
  TargetPopover,
  AutoScale,
  PopoverPosition,
} from 'Components/Common';
import {
  startTimeIcon,
  resetIcon,
  applyIcon,
  calendarIcon,
  downChevronIcon,
  filterOnIcon,
} from 'images/icons/common';
import { i18n } from 'utilities/decorators';
import { InputNumber } from '../InputNumber/InputNumber';

const Container = styled.div`
  width: fit-content;
  padding: 15px;
  background: #ffffff;
`;

const LeftAlignFormButton = styled(FormButton)`
  text-align: left;
`;

const TimeContainer = styled.div`
  width: 100px;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Divider = styled.div`
  height: 100%;
  border-left: 1px solid #c9d0db;
  margin: 0 3px;
`;

const Separator = styled.div`
  width: calc(100% - 26px);
  margin: 13px;
  border-bottom: 1px solid #c9d0db;
`;

const ActionsContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

const CheckIcon = styled(SvgImage)`
  display: inline-flex;
  flex: 0 0 auto;
  height: 15px;
  width: 15px;
  margin-left: 15px;
  color: #66D587;
`;

export class DateTimeSelect extends React.PureComponent {
  static propTypes = {
    disabled: PropTypes.bool,
    isChecked: PropTypes.bool,
    value: PropTypes.object,
    placeholder: PropTypes.string,
    initialMonth: PropTypes.any,
    isForm: PropTypes.bool,
    minDate: PropTypes.object,
    maxDate: PropTypes.object,
    labelIcon: PropTypes.node,
    labelText: PropTypes.string,
    position: PropTypes.string,
    popoverProps: PropTypes.object,
    onChange: PropTypes.func,
  };

  static defaultProps = {
    value: moment(),
    isForm: false,
    position: PopoverPosition.BOTTOM,
  };

  get label() {
    const { value, placeholder } = this.props;
    if (!value) {
      return placeholder || '-';
    }
    return value.format('MMM D, YYYY | hh:mm');
  }

  updateHours = (newHour) => {
    const { value, onChange } = this.props;
    const newValue = moment(value).hours(newHour);
    if (onChange) {
      onChange(newValue);
    }
  }

  updateMinutes = (newMinute) => {
    const { value, onChange } = this.props;
    const newValue = moment(value).minutes(newMinute);
    if (onChange) {
      onChange(newValue);
    }
  }

  renderPopupContent = ({ closePopup }) => {
    const { onChange, value, minDate, maxDate, initialMonth, labelIcon, labelText } = this.props;
    const hours = value.hours();
    const minutes = value.minutes();
    return (
      <Scrollbars autoHide autoHeight autoHeightMin="20px" autoHeightMax="70vh">
        <Container>
          <AutoScale breakpoint={1024} scaleDesktop={0.8}>
            <Calendar
              value={[value]}
              minDate={minDate}
              maxDate={maxDate}
              initialMonth={initialMonth}
              labelIcon={labelIcon || startTimeIcon}
              labelText={labelText}
              onSelect={onChange}
            />
          </AutoScale>
          <TimeContainer>
            <InputNumber
              mini
              value={hours}
              max={23}
              min={0}
              onChange={this.updateHours}
            />
            <Divider />
            <InputNumber
              mini
              value={minutes}
              max={59}
              min={0}
              onChange={this.updateMinutes}
            />
          </TimeContainer>
          <Separator />
          <ActionsContainer>
            <InlineButton
              text={i18n.global('CommonComponents.DateRangeSelect.ResetButton.Text')}
              icon={resetIcon}
              onClick={() => onChange(null)}
              large
            />
            <InlineButton
              text={i18n.global('CommonComponents.DateRangeSelect.ApplyButton.Text')}
              icon={applyIcon}
              onClick={closePopup}
              large
            />
          </ActionsContainer>
        </Container>
      </Scrollbars>
    );
  }

  renderButton = () => {
    const { disabled, isChecked, isForm } = this.props;
    if (isForm) {
      return <LeftAlignFormButton fullWidth disabled={disabled} rightIcon={downChevronIcon} text={this.label} />;
    }

    return <CardButton
      disabled={disabled}
      rightIcon={calendarIcon}
      text={this.label}
      leftIcon={isChecked && <CheckIcon source={filterOnIcon} />}
    />;
  }

  render() {
    const { popoverProps } = this.props;

    return (
      <TargetPopover
        {...popoverProps}
        contentRenderer={this.renderPopupContent}
      >
        {this.renderButton()}
      </TargetPopover>
    );
  }
}
