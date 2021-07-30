import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Scrollbars } from 'react-custom-scrollbars';

import { TargetPopover, DateRangePicker, InlineButton, FormButton } from 'Components/Common';
import {
  resetIcon,
  applyIcon,
  calendarIcon,
} from 'images/icons/common';
import { i18n } from 'utilities/decorators';
import { AutoScale } from '../AutoScale/AutoScale';
import { PopoverPosition } from '../Popover/Popover';

const Container = styled.div`
  width: fit-content;
  padding: 15px;
  background: #ffffff;
`;

const Separator = styled.div`
  width: calc(100% - 26px);
  margin: 13px;
  border-bottom: 1px solid #c9d0db;

  @media screen and (max-width: 1024px) {
    border-bottom: none;
  }
`;

const ActionsContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;


// NOTE: instead of DateRangeInput without editing in input field
export class DateRangeSelect extends React.PureComponent {
  static propTypes = {
    // NOTE: value is an array of moment
    value: PropTypes.arrayOf(PropTypes.object),
    placeholder: PropTypes.string,
    minDate: PropTypes.object,
    maxDate: PropTypes.object,
    onChange: PropTypes.func,
    position: PropTypes.string,
  };

  static defaultProps = {
    value: [],
    position: PopoverPosition.BOTTOM,
  };

  get label() {
    const { value: [startDate, endDate], placeholder } = this.props;
    if (!startDate) {
      return placeholder || '-';
    }
    return startDate.format('MMM D, YYYY') + (endDate ? ` - ${endDate.format('MMM D, YYYY')}` : '');
  }

  renderPopupContent = ({ closePopup }) => {
    const { onChange, value, minDate, maxDate } = this.props;
    return (
      <Scrollbars autoHide autoHeight autoHeightMin="20px" autoHeightMax="70vh">
        <Container onClick={event => event.stopPropagation()}>
          <AutoScale breakpoint={1024} scaleDesktop={0.8}>
            <DateRangePicker
              value={value}
              minDate={minDate}
              maxDate={maxDate}
              onChange={onChange}
            />
          </AutoScale>
          <Separator />
          <ActionsContainer>
            <InlineButton
              text={i18n.global('CommonComponents.DateRangeSelect.ResetButton.Text')}
              icon={resetIcon}
              onClick={() => onChange([])}
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

  render() {
    const { position } = this.props;

    return (
      <TargetPopover
        disableReposition
        position={position}
        contentRenderer={this.renderPopupContent}
      >
        <FormButton fullWidth rightIcon={calendarIcon} text={this.label} />
      </TargetPopover>
    );
  }
}
