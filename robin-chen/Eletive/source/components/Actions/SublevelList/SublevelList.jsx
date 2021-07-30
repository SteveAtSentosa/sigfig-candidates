import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { withTranslation } from 'utilities/decorators';
import * as Models from 'Models';
import { getSegmentList, parseSegmentID } from 'services/attributes';
import { getUserListBySegment } from 'services/users';

import { InlineButton, SingleSelect as Select, FormGroup } from 'Components/Common';
import { SublevelListItem } from 'Components/Actions';
import { plusIcon } from 'images/icons/common';

import * as OwnComponents from './SublevelList.Components';

@withTranslation('SublevelList')
class SublevelList extends React.PureComponent {
  static propTypes = {
    isEmployees: PropTypes.bool,
    objectives: Models.Actions.ObjectiveList,
    userList: Models.User.UserList,
    attributeList: Models.Attribute.AttributeList,
    showObjectives: Models.Actions.ObjectiveList,
  }


  constructor(props) {
    super(props);

    this.sublevelItemsRefs = {};
  }

  state = {
    sortingItem: this.sortingItems[0],
    haveObjectiveItem: this.haveObjectiveFilterItems[0],
    attributeFilterItem: this.attributeFilterItems[0],
  };

  get sortingItems() {
    const { i18n } = this.props;
    return [
      {
        id: 0,
        title: i18n('ListPanel.SortBy.Values.ObjectivesMost'),
        sort: item => this.sublevelItemsRefs[item.id]
          && this.sublevelItemsRefs[item.id].current
          && this.sublevelItemsRefs[item.id].current.objectivesCount,
        reverse: true,
      },
      {
        id: 1,
        title: i18n('ListPanel.SortBy.Values.ObjectivesLeast'),
        sort: item => this.sublevelItemsRefs[item.id]
          && this.sublevelItemsRefs[item.id].current
          && this.sublevelItemsRefs[item.id].current.objectivesCount,
      },
    ];
  }

  get attributeFilterItems() {
    const { i18n, attributeList } = this.props;
    return [
      { id: null, title: i18n('ListPanel.AttributeFilter.Values.All') },
      ...attributeList.map(item => ({ id: item.id, title: item.name }))];
  }

  get haveObjectiveFilterItems() {
    const { i18n } = this.props;
    return [
      {
        id: 0,
        title: i18n('ListPanel.HaveObjectiveFilter.Values.All'),
      },
      {
        id: 1,
        title: i18n('ListPanel.HaveObjectiveFilter.Values.Yes'),
      },
      {
        id: 2,
        title: i18n('ListPanel.HaveObjectiveFilter.Values.No'),
      },
    ];
  }

  get urlSegmentID() {
    const { match } = this.props;
    const { params: { segmentID } } = match;
    return segmentID;
  }

  getSegmentList = () => {
    const { attributeList } = this.props;

    return getSegmentList(attributeList, true);
  }

  getEmployeesList = () => {
    const { attributeList, userList } = this.props;
    const segment = this.urlSegmentID;
    const { attributeID, segmentValue, segmentValueUpTo } = parseSegmentID(segment);
    const attribute = attributeList.find(e => e.id === attributeID);
    return getUserListBySegment(userList, attribute, { value: segmentValue, valueUpTo: segmentValueUpTo });
  }

  filterSortItems = (items) => {
    const { sortingItem, attributeFilterItem } = this.state;
    const { sort, reverse } = sortingItem;

    let result = items;

    if (attributeFilterItem.id !== null) {
      result = result.filter(e => e.attribute.id === attributeFilterItem.id);
    }

    if (!sort) {
      return result;
    }
    const r = reverse ? -1 : 1;
    if (typeof sort === 'function') {
      return result.sort((a, b) => {
        const av = sort(a);
        const bv = sort(b);
        if (av > bv) {
          return r;
        }
        return av < bv ? -1 * r : 0;
      });
    }
    return result.sort((a, b) => {
      if (a[sort] > b[sort]) {
        return r;
      }
      return a[sort] < b[sort] ? -1 * r : 0;
    });
  }

  handleExpandAll = () => {
    const refKeys = Object.keys(this.sublevelItemsRefs);
    const allExpanded = !refKeys.some(key => !this.sublevelItemsRefs[key].current.isExpanded);
    refKeys.forEach((key) => {
      this.sublevelItemsRefs[key].current.expandCollapse = !allExpanded;
    });
  }

  handleChangeSortBy = (sortingItem) => {
    this.setState({ sortingItem });
  }

  handleChangeHaveObjectiveFilter = (haveObjectiveItem) => {
    this.setState({ haveObjectiveItem });
  }

  handleChangeAttributeFilter = (attributeFilterItem) => {
    this.setState({ attributeFilterItem });
  }

  render() {
    const { i18n, objectives, showObjectives, isEmployees } = this.props;

    const { sortingItem, haveObjectiveItem, attributeFilterItem } = this.state;

    const items = this.filterSortItems(isEmployees ? this.getEmployeesList() : this.getSegmentList());

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

          {!isEmployees &&
          <OwnComponents.LabelWrap>
            <FormGroup inlineOnSmallScreen label={i18n('ListPanel.AttributeFilter.Label')}>
              <Select
                items={this.attributeFilterItems}
                activeItem={attributeFilterItem}
                onItemSelect={this.handleChangeAttributeFilter}
              />
            </FormGroup>
          </OwnComponents.LabelWrap>
          }
          <OwnComponents.LabelWrap>
            <FormGroup inlineOnSmallScreen label={i18n('ListPanel.HaveObjectiveFilter.Label')}>
              <Select
                items={this.haveObjectiveFilterItems}
                activeItem={haveObjectiveItem}
                onItemSelect={this.handleChangeHaveObjectiveFilter}
              />
            </FormGroup>
          </OwnComponents.LabelWrap>
          <OwnComponents.LabelWrap>
            <FormGroup inlineOnSmallScreen label={i18n('ListPanel.SortBy.Label')}>
              <Select
                items={this.sortingItems}
                activeItem={sortingItem}
                onItemSelect={this.handleChangeSortBy}
              />
            </FormGroup>
          </OwnComponents.LabelWrap>
        </OwnComponents.PanelContainer>
        <OwnComponents.ListContainer>
          {items.map((item) => {
            if (!this.sublevelItemsRefs[item.id]) {
              this.sublevelItemsRefs[item.id] = React.createRef();
            }
            return (
              <SublevelListItem
                ref={this.sublevelItemsRefs[item.id]}
                key={item.id}
                noShowIfNoObjectives={haveObjectiveItem.id === 1}
                noShowIfHaveObjectives={haveObjectiveItem.id === 2}
                segment={!isEmployees ? item : undefined}
                user={isEmployees ? item : undefined}
                objectiveList={objectives}
                showObjectives={showObjectives}
              />
            );
          })
          }
        </OwnComponents.ListContainer>
      </OwnComponents.Container>
    );
  }
}

const WithRouterSublevelList = withRouter(SublevelList);
export { WithRouterSublevelList as SublevelList };
