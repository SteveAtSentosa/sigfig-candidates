import React from 'react';
import PropTypes from 'prop-types';

import * as Models from 'Models';

import { downChevronIcon, rightChevronIcon } from 'images/icons/common';
import { ObjectiveListItem } from 'Components/Actions';
import { Expandable } from 'Components/Common';

import * as Own from './SublevelListItem.Components';

export class SublevelListItem extends React.PureComponent {
  static propTypes = {
    noShowIfNoObjectives: PropTypes.bool,
    noShowIfHaveObjectives: PropTypes.bool,
    segment: PropTypes.object,
    user: PropTypes.object,
    objectiveList: Models.Actions.ObjectiveList,
    showObjectives: Models.Actions.ObjectiveList,
  };

  constructor(props) {
    super(props);

    this.objectiveRefs = {};
  }

  state = {
    expanded: false,
    segmentObjectives: [],
  };

  componentDidUpdate(prevProps) {
    const { segment, user, showObjectives } = this.props;
    if (segment === prevProps.segment && showObjectives === prevProps.showObjectives) {
      return;
    }
    const segmentObjectives = segment
      ? this.getSegmentObjectives(segment.id)
      : this.getEmployeeObjectives(user.id);
    this.setState({ segmentObjectives });
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
      if (this.objectiveRefs[key].current) {
        this.objectiveRefs[key].current.expandCollapse = expanded;
      }
    });
  }

  getSegmentObjectives(segmentID) {
    const { showObjectives } = this.props;
    const objectives = showObjectives.filter((e) => {
      if (e.subject !== segmentID) {
        return false;
      }
      return true;
    });

    return objectives;
  }

  getEmployeeObjectives(userID) {
    const { showObjectives } = this.props;
    const objectives = showObjectives.filter((e) => {
      if (Number(e.subject) !== userID) {
        return false;
      }
      return true;
    });
    return objectives;
  }

  handleHeaderClick = () => {
    const { expanded } = this.state;

    this.setState({
      expanded: !expanded,
    });
  }

  renderSubObjectiveTree() {
    const { objectiveList } = this.props;
    const { segmentObjectives } = this.state;
    return (
      <Own.ObjectiveWrapper>
        {segmentObjectives.map((objective) => {
          if (!this.objectiveRefs[objective.id]) {
            this.objectiveRefs[objective.id] = React.createRef();
          }
          return (
            <ObjectiveListItem
              isHaveDot
              ref={this.objectiveRefs[objective.id]}
              key={objective.id}
              objective={objective}
              objectiveList={objectiveList}
            />
          );
        })}
      </Own.ObjectiveWrapper>
    );
  }

  renderHeader() {
    const { segment, user } = this.props;
    const { expanded, segmentObjectives } = this.state;
    return (
      <Own.Header expanded={expanded}>
        <Own.HeaderLeft>
          <Own.TitleWrapper onClick={this.handleHeaderClick}>
            <Own.ArrowIcon source={expanded ? downChevronIcon : rightChevronIcon} />
            <Own.Title>
              {segment && `${segment.attribute.name}: ${segment.name}`}
              {user &&
              <>
                {user.name}
                <Own.SubTitle>{user.email}</Own.SubTitle>
              </>
              }
            </Own.Title>
          </Own.TitleWrapper>
        </Own.HeaderLeft>
        <Own.HeaderMiddle>
          {segmentObjectives.length} Objectives
        </Own.HeaderMiddle>
      </Own.Header>
    );
  }

  render() {
    const { noShowIfHaveObjectives, noShowIfNoObjectives } = this.props;
    const { expanded, segmentObjectives } = this.state;

    if ((noShowIfNoObjectives && !segmentObjectives.length) || (noShowIfHaveObjectives && segmentObjectives.length)) {
      return false;
    }

    return (
      <Expandable
        expanded={expanded}
        header={this.renderHeader()}
      >
        {this.renderSubObjectiveTree()}
      </Expandable>
    );
  }
}
