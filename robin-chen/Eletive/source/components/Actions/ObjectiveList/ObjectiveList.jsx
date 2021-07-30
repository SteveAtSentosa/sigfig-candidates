import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { actions } from 'store';
import { withTranslation } from 'utilities/decorators';
import * as Models from 'Models';

import { FormGroup, SingleSelect as Select, InlineButton } from 'Components/Common';
import { ObjectiveListItem } from 'Components/Actions';
import { plusIcon } from 'images/icons/common';

import * as OwnComponents from './ObjectiveList.Components';

@withTranslation('ObjectiveList')
class ObjectiveList extends React.PureComponent {
  static propTypes = {
    objectives: Models.Actions.ObjectiveList,
    showObjectives: Models.Actions.ObjectiveList,
    screenSize: PropTypes.number,
    updateObjective: PropTypes.func,
    onObjectiveEdit: PropTypes.func,
  }

  constructor(props) {
    super(props);

    this.objectiveRefs = {};
  }

  state = {
    sortingItem: { id: 0, sort: 'name' },
  };

  get sortedObjectives() {
    const { showObjectives } = this.props;
    const { sortingItem } = this.state;
    const { sort, reverse } = sortingItem;
    if (!sort) {
      return showObjectives;
    }
    const r = reverse ? -1 : 1;
    if (typeof sort === 'function') {
      return showObjectives.sort((a, b) => {
        const av = sort(a);
        const bv = sort(b);
        // eslint-disable-next-line no-nested-ternary
        return av > bv ? r : (av < bv ? -1 * r : 0);
      });
    }
    // eslint-disable-next-line no-nested-ternary
    return showObjectives.sort((a, b) => (a[sort] > b[sort] ? r : (a[sort] < b[sort] ? -1 * r : 0)));
  }

  handleEditInlineObjective = (objective) => {
    const { updateObjective } = this.props;
    updateObjective && updateObjective(objective);
  }

  handleChangeSortBy = (sortingItem) => {
    this.setState({ sortingItem });
  }

  handleExpandAll = () => {
    const refKeys = Object.keys(this.objectiveRefs);
    const allExpanded = !refKeys.some(key => !this.objectiveRefs[key].current.isExpanded);
    refKeys.forEach((key) => {
      this.objectiveRefs[key].current.expandCollapse = !allExpanded;
    });
  }

  render() {
    const { i18n, objectives, screenSize, showObjectives, onObjectiveEdit } = this.props;
    const { sortingItem } = this.state;
    if (!showObjectives.length) {
      return false;
    }

    const sortingItems = [
      { id: 0, title: i18n('ListPanel.SortBy.Values.AZ'), sort: 'name' },
      { id: 1, title: i18n('ListPanel.SortBy.Values.DueDateAscending'), sort: 'endAt' },
      { id: 2, title: i18n('ListPanel.SortBy.Values.DueDateDescending'), sort: 'endAt', reverse: true },
      {
        id: 3,
        title: i18n('ListPanel.SortBy.Values.ProgressMost'),
        sort: item => this.objectiveRefs[item.id] && this.objectiveRefs[item.id].current.calculatePercentage,
        reverse: true,
      },
      {
        id: 4,
        title: i18n('ListPanel.SortBy.Values.ProgressLeast'),
        sort: item => this.objectiveRefs[item.id] && this.objectiveRefs[item.id].current.calculatePercentage,
      },
      { id: 5, title: i18n('ListPanel.SortBy.Values.CreateDateNewest'), sort: 'createdAt', reverse: true },
      { id: 6, title: i18n('ListPanel.SortBy.Values.CreateDateOldest'), sort: 'createdAt' },
    ];

    return (
      <OwnComponents.Container>
        <OwnComponents.PanelContainer>
          <OwnComponents.ButtonContainer>
            <InlineButton
              icon={plusIcon}
              text={i18n('ListPanel.ExpandButton.Text')}
              onClick={this.handleExpandAll}
            />
          </OwnComponents.ButtonContainer>
          <OwnComponents.SortContainer>
            <FormGroup inline label={i18n('ListPanel.SortBy.Label')}>
              <Select
                items={sortingItems}
                activeItem={sortingItem}
                onItemSelect={this.handleChangeSortBy}
              />
            </FormGroup>
          </OwnComponents.SortContainer>
        </OwnComponents.PanelContainer>
        <OwnComponents.ListContainer>
          {
            this.sortedObjectives.map((objective) => {
              if (!this.objectiveRefs[objective.id]) {
                this.objectiveRefs[objective.id] = React.createRef();
              }
              return <ObjectiveListItem
                ref={this.objectiveRefs[objective.id]}
                key={objective.id}
                i18n={i18n}
                objective={objective}
                objectiveList={objectives}
                screenSize={screenSize}
                onObjectiveEdit={objective.isWriteAccess ? onObjectiveEdit : undefined}
                onObjectiveEditInline={objective.isWriteAccess ? this.handleEditInlineObjective : undefined}
              />;
            })
          }
        </OwnComponents.ListContainer>
      </OwnComponents.Container>
    );
  }
}

const mapStateToProps = ({ app: { screenSize } }) => ({
  screenSize,
});

const ConnectedObjectiveList = connect(mapStateToProps, {
  ...actions.actions,
})(ObjectiveList);

const WithRouterObjectiveList = withRouter(ConnectedObjectiveList);
export { WithRouterObjectiveList as ObjectiveList };
