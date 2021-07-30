import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { withTranslation } from 'utilities/decorators';
import { RoundedButtonIntent, DateRangePicker, FormActions, SvgImage, InputNumber } from 'Components/Common';
import { timeIcon } from 'images/icons/common';


const LaunchTitle = styled.div`
  text-align: center;
  margin-bottom: 40px;
  font-weight: 600;
  font-size: 22px;
  color: #354A60;
`;

const TimeIcon = styled(SvgImage).attrs({ source: timeIcon })`
color: #354a60;
  svg {
    width: 24px;
    height: 24px;
  }
`;

const TimeLabelContainer = styled.div`
  display: flex;
  margin-top: 35px;
  color: #707E93;
  font-weight: 500;
  font-size: 17px;


  span {
    margin-left: 10px;
  }
`;

const TimeContainer = styled.div`
  display: flex;
  width: 586px;
  margin-top: 20px;
`;

const HourContainer = styled.div`
  flex: 1 25%;
  padding-right: 20px;
`;

const MinutesContainer = styled.div`
  flex: 1 25%;
  padding-right: 10px;
`;

const TimezoneContainer = styled.div`
  flex: 1 50%;
  padding-left: 10px;
`;

@withTranslation('CustomSurvey/SelectTargetAndLaunch')
class ScheduleLaunchDate extends React.PureComponent {
  static propTypes = {
    startDate: PropTypes.object,
    finalDate: PropTypes.object,
    onSubmit: PropTypes.func,
    onCancel: PropTypes.func,
  };

  constructor(props) {
    super(props);
    const startDate = moment();
    const finalDate = moment(startDate).add(2, 'weeks');

    this.state = {
      dateSettings: { startDate, finalDate },
    };
  }

  componentDidMount() {
    const { startDate, finalDate } = this.props;

    if (startDate) {
      this.setState({
        dateSettings: {
          startDate,
          finalDate,
        },
      });
    }
  }

  get startDateHours() {
    const { dateSettings: { startDate } } = this.state;
    return moment(startDate).hour();
  }

  get startDateMinutes() {
    const { dateSettings: { startDate } } = this.state;
    return moment(startDate).minute();
  }

  handleDateRangeChange = (dateRange) => {
    const [startDate, finalDate] = dateRange;

    this.setState({
      dateSettings: {
        startDate,
        finalDate,
      },
    });
  };

  handleChangeHours = (hours) => {
    const { dateSettings } = this.state;
    const startDate = moment(dateSettings.startDate).hour(hours);
    this.setState({
      dateSettings: {
        ...dateSettings,
        startDate,
      },
    });
  };

  handleChangeMinutes = (minutes) => {
    const { dateSettings } = this.state;
    const startDate = moment(dateSettings.startDate).minute(minutes);
    this.setState({
      dateSettings: {
        ...dateSettings,
        startDate,
      },
    });
  };

  handleSubmit = () => {
    const { onSubmit } = this.props;
    const { dateSettings } = this.state;

    onSubmit(dateSettings);
  };

  render() {
    const { i18n, onCancel } = this.props;
    const { dateSettings } = this.state;

    const actionList = [
      {
        onClick: onCancel,
        children: i18n.global('CustomSurveysPage.ActionButtons.CancelButton.Text'),
        isInline: true,
      },
      {
        onClick: this.handleSubmit,
        children: i18n.global('CustomSurveysPage.ActionButtons.LaunchButton.Text'),
        intent: RoundedButtonIntent.SUCCESS,
      },
    ];

    return (
      <>
        <LaunchTitle>{i18n('ScheduleForm.Title')}</LaunchTitle>
        <DateRangePicker
          value={[dateSettings.startDate, dateSettings.finalDate]}
          onChange={this.handleDateRangeChange}
        />
        <TimeLabelContainer>
          <TimeIcon />
          <span>{i18n.global('CustomSurveysPage.ScheduleDate.TimeLabel')}</span>
        </TimeLabelContainer>
        <TimeContainer>
          <HourContainer>
            <InputNumber
              min={0}
              max={23}
              placeholder="HH"
              value={this.startDateHours}
              onChange={this.handleChangeHours}
            />
          </HourContainer>
          <MinutesContainer>
            <InputNumber
              min={0}
              max={59}
              placeholder="MM"
              value={this.startDateMinutes}
              onChange={this.handleChangeMinutes}
            />
          </MinutesContainer>
          {/* TODO: add tz picker */}
          <TimezoneContainer />
        </TimeContainer>
        <FormActions actions={actionList} />
      </>
    );
  }
}

export { ScheduleLaunchDate };
