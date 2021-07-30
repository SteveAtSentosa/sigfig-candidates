import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import { ScreenSizes } from 'utilities/common';
import { Objective, ObjectiveList } from 'Models/Actions';

import {
  editIcon,
  downChevronIcon,
  rightChevronIcon,
} from 'images/icons/common';

import { ActionMenu, Expandable, InlinePieChart } from 'Components/Common';
import { ObjectiveItemKeyResultList } from '../ObjectiveItemKeyResultList/ObjectiveItemKeyResultList';
import * as Own from './ObjectiveListItem.Components';

class ObjectiveListItem extends React.PureComponent {
  static propTypes = {
    isHaveDot: PropTypes.bool,
    objective: Objective,
    objectiveList: ObjectiveList,
    screenSize: PropTypes.number,
    onObjectiveEdit: PropTypes.func,
    onObjectiveEditInline: PropTypes.func,
  };

  constructor(props) {
    super(props);

    this.objectiveRefs = {};
  }

  state = {
    expanded: false,
  };

  get calculatePercentage() {
    const { objective: { objectiveKeys } } = this.props;
    const total = objectiveKeys.reduce((sum, { value, minValue, maxValue }) => {
      const divisor = maxValue - minValue;

      const percentage = divisor > 0 ? (value - minValue) / divisor : 0;
      return sum + percentage;
    }, 0);

    return total / objectiveKeys.length;
  }

  get days() {
    const { objective: { endAt } } = this.props;

    return moment.unix(endAt).diff(moment(), 'days');
  }

  get actionItems() {
    return [
      {
        title: 'Edit',
        icon: editIcon,
        onClick: this.handleEdit,
        'data-cy': 'edit',
      },
    ];
  }

  get isExpanded() {
    const { expanded } = this.state;
    return expanded;
  }

  set expandCollapse(expanded) {
    this.setState({
      expanded,
    });
    const refKeys = Object.keys(this.objectiveRefs);
    refKeys.forEach((key) => {
      this.objectiveRefs[key].current.expandCollapse = expanded;
    });
  }

  handleHeaderClick = () => {
    const { expanded } = this.state;

    this.setState({
      expanded: !expanded,
    });
  }

  handleStatusChange = (newStatus) => {
    const { objective, onObjectiveEditInline } = this.props;
    const updatedObjective = { ...objective, status: newStatus };

    onObjectiveEditInline && onObjectiveEditInline(updatedObjective);
  }

  handleEdit = () => {
    const { onObjectiveEdit, objective } = this.props;
    onObjectiveEdit && onObjectiveEdit(objective.id);
  }

  handleInlineEdit = (key, index) => {
    const { objective, onObjectiveEditInline } = this.props;
    const { objectiveKeys: currentKeys } = objective;

    const objectiveKeys = [...currentKeys];
    objectiveKeys[index] = key;

    const updatedObjective = { ...objective, objectiveKeys };
    onObjectiveEditInline && onObjectiveEditInline(updatedObjective);
  }

  renderSubObjectiveTree = () => {
    const { objective, objectiveList } = this.props;
    const subObjectives = objectiveList.filter(({ parent }) => objective.id === parent);

    if (subObjectives.length === 0) {
      return null;
    }

    return subObjectives.map((subObjective) => {
      if (!this.objectiveRefs[objective.id]) {
        this.objectiveRefs[objective.id] = React.createRef();
      }

      return <ObjectiveListItem
        isHaveDot
        ref={this.objectiveRefs[objective.id]}
        key={objective.id}
        objective={subObjective}
        objectiveList={objectiveList}
      />;
    });
  }

  renderDesktopHeader = () => {
    const { objective: { name, status }, onObjectiveEdit, onObjectiveEditInline, isHaveDot, i18n } = this.props;
    const { expanded } = this.state;
    const percentage = this.calculatePercentage;

    return (
      <Own.Header expanded={expanded}>
        { isHaveDot && <Own.Dot /> }
        <Own.HeaderLeft>
          <Own.TitleWrapper onClick={this.handleHeaderClick}>
            <Own.ArrowIcon source={expanded ? downChevronIcon : rightChevronIcon} />
            <Own.Title>{ name }</Own.Title>
          </Own.TitleWrapper>
          {
            onObjectiveEditInline &&
            <Own.StatusCircles
              status={status}
              i18n={i18n}
              onChangeStatus={this.handleStatusChange}
            />
          }
        </Own.HeaderLeft>
        <Own.HeaderMiddle>
          <Own.Days>{this.days} Days</Own.Days>
        </Own.HeaderMiddle>
        <Own.HeaderRight>
          <InlinePieChart percentage={percentage} />
          <Own.Percentage>{`${(percentage * 100).toFixed(0)}%`}</Own.Percentage>
          { onObjectiveEdit &&
          <ActionMenu popoverProps={{ position: 'bottom', align: 'end' }} items={this.actionItems} />
          }
        </Own.HeaderRight>
      </Own.Header>
    );
  }

  renderMobileHeader = () => {
    const { objective: { name, status }, onObjectiveEdit, onObjectiveEditInline, isHaveDot, i18n } = this.props;
    const { expanded } = this.state;
    const percentage = this.calculatePercentage;

    return (
      <Own.MobileHeader expanded={expanded}>
        { isHaveDot && <Own.Dot /> }
        <Own.ArrowIcon
          source={expanded ? downChevronIcon : rightChevronIcon}
          onClick={this.handleHeaderClick}
        />
        <Own.MobileHeaderContent>
          <Own.MobileHeaderHalf>
            <Own.Title>{ name }</Own.Title>
            { onObjectiveEditInline &&
            <ActionMenu popoverProps={{ position: 'bottom', align: 'end' }} items={this.actionItems} />
            }
          </Own.MobileHeaderHalf>
          <Own.MobileHeaderHalf>
            {
              onObjectiveEdit &&
              <Own.StatusCircles
                status={status}
                i18n={i18n}
                onChangeStatus={this.handleStatusChange}
              />
            }
            <Own.DaysWrapper>
              <Own.Days>{this.days} Days</Own.Days>
            </Own.DaysWrapper>
            <Own.PercentageWrapper>
              <InlinePieChart percentage={percentage} />
              <Own.Percentage>{`${(percentage * 100).toFixed(0)}%`}</Own.Percentage>
            </Own.PercentageWrapper>
          </Own.MobileHeaderHalf>
        </Own.MobileHeaderContent>
      </Own.MobileHeader>
    );
  }

  render() {
    const { objective: { objectiveKeys }, screenSize, onObjectiveEditInline } = this.props;
    const { expanded } = this.state;
    const isMobile = screenSize < ScreenSizes.md;

    return (
      <Expandable
        expanded={expanded}
        header={isMobile ? this.renderMobileHeader() : this.renderDesktopHeader()}
      >
        <Own.ObjectiveItemKeyResultListWrapper>
          <ObjectiveItemKeyResultList
            items={objectiveKeys}
            onChange={onObjectiveEditInline && this.handleInlineEdit}
          />
        </Own.ObjectiveItemKeyResultListWrapper>
        { this.renderSubObjectiveTree() }
      </Expandable>
    );
  }
}

export { ObjectiveListItem };
