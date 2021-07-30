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

const Container = styled.div`
  width: fit-content;
  padding: 15px;
  background: #ffffff;
`;

const LeftAlignFormButton = styled(FormButton)`
  text-align: left;
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

export class DateSelect extends React.PureComponent {
  static propTypes = {
    disabled: PropTypes.bool,
    isChecked: PropTypes.bool,
    value: PropTypes.object,
    placeholder: PropTypes.string,
    initialMonth: PropTypes.any,
    isForm: PropTypes.bool,
    autoClose: PropTypes.bool,
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
    return value.format('MMM D, YYYY');
  }

  handleChange = closePopup => (value) => {
    const { onChange, autoClose } = this.props;

    onChange(value);
    autoClose && closePopup();
  }

  renderPopupContent = ({ closePopup }) => {
    const { onChange, value, minDate, maxDate, initialMonth, labelIcon, labelText } = this.props;

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
              onSelect={this.handleChange(closePopup)}
            />
          </AutoScale>
          <Separator />
          <ActionsContainer>
            <InlineButton
              large
              text={i18n.global('CommonComponents.DateRangeSelect.ResetButton.Text')}
              icon={resetIcon}
              onClick={() => onChange(null)}
            />
            <InlineButton
              large
              text={i18n.global('CommonComponents.DateRangeSelect.ApplyButton.Text')}
              icon={applyIcon}
              onClick={closePopup}
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
