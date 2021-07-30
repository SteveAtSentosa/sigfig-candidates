import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { withTranslation } from 'utilities/decorators';
import { parseSegmentID } from 'services/attributes';
import { getUserListBySegment } from 'services/users';
import * as Models from 'Models';
import Constants from 'Constants/Actions';
import ObjectiveStatisticCard from '../ObjectiveStatisticCard/ObjectiveStatisticCard';

import * as OwnComponents from './Statistics.Component';


@withTranslation('Statistics')
class Statistics extends React.Component {
  static propTypes = {
    objectives: Models.Actions.ObjectiveList.isRequired,
    filteredObjectives: Models.Actions.ObjectiveList.isRequired,
    filteredObjectivesMain: Models.Actions.ObjectiveList.isRequired,
    userList: Models.User.UserList.isRequired,
    segmentList: Models.Attribute.ExtendedSegmentList.isRequired,
    attributeList: Models.Attribute.AttributeList,
    isOrganization: PropTypes.bool,
    segmentID: PropTypes.string,
  }

  get employeesList() {
    const { attributeList, userList, segmentID } = this.props;
    const { attributeID, segmentValue, segmentValueUpTo } = parseSegmentID(segmentID);
    const attribute = attributeList.find(e => e.id === attributeID);
    return getUserListBySegment(userList, attribute, { value: segmentValue, valueUpTo: segmentValueUpTo });
  }

  get statusData() {
    const { filteredObjectivesMain: objectives, i18n } = this.props;
    const numberOfObjectives = objectives.length;
    const objectivesInStatus = _.reduce(objectives, (accumulator, item) => {
      if (item.status !== null) {
        accumulator[item.status] += 1;
      }

      return accumulator;
    }, [0, 0, 0]);

    const onTrack = Math.round(
      objectivesInStatus[Constants.ObjectiveStatus.OnTrack] / numberOfObjectives * 100,
    );
    const behind = Math.round(
      objectivesInStatus[Constants.ObjectiveStatus.Behind] / numberOfObjectives * 100,
    );
    const atRisk = Math.round(
      objectivesInStatus[Constants.ObjectiveStatus.AtRisk] / numberOfObjectives * 100,
    );

    return [
      {
        name: i18n('Legend.OnTrack'),
        value: onTrack,
      },
      {
        name: i18n('Legend.Behind'),
        value: behind,
      },
      {
        name: i18n('Legend.AtRisk'),
        value: atRisk,
      },
      {
        name: i18n('Legend.NoStatus'),
        value: 100 - (onTrack + behind + atRisk),
      },
    ];
  }

  get employeesData() {
    const { userList, filteredObjectives: objectives, i18n, isOrganization, segmentID } = this.props;
    const dataList = !isOrganization && segmentID ? this.employeesList : userList;
    const numberOfEmployees = dataList.length;
    const employeesWithObjective = dataList.filter(item => (objectives.find(objective => (
      objective.subjectType === Constants.ObjectiveSubjectTypes.User && Number(objective.subject) === item.id
    ))));
    const numberOfEmployeesWithObjective = employeesWithObjective.length;
    const withLegend = Math.round(numberOfEmployeesWithObjective / numberOfEmployees * 100);
    return [
      {
        name: i18n('Legend.With'),
        value: withLegend,
      },
      {
        name: i18n('Legend.Without'),
        value: 100 - withLegend,
      },
    ];
  }

  get segmentsData() {
    const { segmentList, filteredObjectives: objectives, i18n } = this.props;
    const numberOfSegments = segmentList.length;
    const segmentsWithObjectives = segmentList.filter(item => (objectives.find(objective => (
      objective.subjectType === Constants.ObjectiveSubjectTypes.Segment && objective.subject === item.id
    ))));
    const numberOfSegmentsWithObjectives = segmentsWithObjectives.length;

    const withLegend = Math.round(numberOfSegmentsWithObjectives / numberOfSegments * 100);

    return [
      {
        name: i18n('Legend.With'),
        value: withLegend,
      },
      {
        name: i18n('Legend.Without'),
        value: 100 - withLegend,
      },
    ];
  }

  get alignedData() {
    const { filteredObjectivesMain, objectives, i18n } = this.props;
    const numberOfObjectives = filteredObjectivesMain.length;

    const objectivesWithChildren = filteredObjectivesMain.filter(({ id }) => (
      objectives.find(({ parent }) => parent === id)
    ));
    const numberOfAlignedObjectives = objectivesWithChildren.length;

    const aligned = Math.round(numberOfAlignedObjectives / numberOfObjectives * 100);
    return [
      {
        name: i18n('Legend.Aligned'),
        value: aligned,
      },
      {
        name: i18n('Legend.NotAligned'),
        value: 100 - aligned,
      },
    ];
  }

  getCenterText(data, value, noDataTextKey) {
    const { i18n } = this.props;
    return (data && data.length > 0) ? `${value}%` : i18n(noDataTextKey);
  }

  render() {
    const { i18n, isOrganization, segmentID, filteredObjectivesMain, userList, segmentList } = this.props;

    const statusCardCenterValue = this.statusData[0].value;
    const employeesCardCenterValue = this.employeesData[0].value;
    const alignedCardCenterValue = this.alignedData[0].value;
    const segmentsCardCenterValue = this.segmentsData[0].value;
    const employeesList = !isOrganization && segmentID ? this.employeesList : userList;

    return (
      <OwnComponents.Container>
        <OwnComponents.DynamicWidthCardContainer isFullWith={!isOrganization}>
          <ObjectiveStatisticCard
            title={i18n('Header.ObjectiveStatus')}
            data={this.statusData}
            colors={Constants.StatisticsPieChartColors.ObjectiveStatus}
            centerText={this.getCenterText(filteredObjectivesMain, statusCardCenterValue, 'NoObjectives')}
          />
        </OwnComponents.DynamicWidthCardContainer>
        {(isOrganization || segmentID) &&
          <>
            <ObjectiveStatisticCard
              title={i18n('Header.EmployeesWithObjectives')}
              data={this.employeesData}
              colors={Constants.StatisticsPieChartColors.Employees}
              centerText={this.getCenterText(
                employeesList,
                employeesCardCenterValue,
                'NoEmployees',
              )}
            />
            <ObjectiveStatisticCard
              title={i18n('Header.ObjectAlignment')}
              data={this.alignedData}
              colors={Constants.StatisticsPieChartColors.ObjectAlignment}
              centerText={this.getCenterText(filteredObjectivesMain, alignedCardCenterValue, 'NoObjectives')}
            />
          </>
        }
        {isOrganization &&
          <ObjectiveStatisticCard
            title={i18n('Header.SegmentsWithObjectives')}
            data={this.segmentsData}
            colors={Constants.StatisticsPieChartColors.Segments}
            centerText={this.getCenterText(segmentList, segmentsCardCenterValue, 'NoSegments')}
          />
        }
      </OwnComponents.Container>
    );
  }
}

export default Statistics;
