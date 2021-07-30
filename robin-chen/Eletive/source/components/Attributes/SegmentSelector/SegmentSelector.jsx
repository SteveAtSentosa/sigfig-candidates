import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import fuzzysearch from 'fuzzysearch';

import { downChevronIcon, segmentMenuIcon } from 'images/icons/common';
import { getSegmentList } from 'services/attributes';
import { getTargetFilterUserCountFromSegments } from 'services/users';
import { actions, selectors } from 'store';
import { withTranslation } from 'utilities/decorators';

import * as AttributeModels from 'Models/Attributes';
import * as UserModels from 'Models/Users';

import { FormGroup, Helpers, InputGroup, Popover, PopoverPosition } from 'Components/Common';
import { AttributeListItem } from './AttributeListItem/AttributeListItem';

import * as Own from './SegmentSelector.Components';

@withTranslation('SegmentSelector')
class SegmentSelector extends React.Component {
  static propTypes = {
    fillContainer: PropTypes.bool,
    selectChildSegments: PropTypes.bool,
    singleSelectionMode: PropTypes.bool,
    expandAttributeSegmentList: PropTypes.bool,
    popoverAlign: PropTypes.string,
    formLabel: PropTypes.string,
    icon: PropTypes.node,
    userList: UserModels.UserList,
    defaultSegmentList: AttributeModels.ExtendedSegmentList.isRequired,
    filterSegmentList: PropTypes.func,
    selectedSegmentIds: PropTypes.arrayOf(PropTypes.string),
    selectFirstSegmentByDefault: PropTypes.bool,
    willUpdateStore: PropTypes.bool,
    segmentReportSelectSegment: PropTypes.func,
    fetchAttributeList: PropTypes.func,
    fetchUserList: PropTypes.func,
    onChange: PropTypes.func,
    onTargetUserCountChange: PropTypes.func,
  }

  static defaultProps = {
    fillContainer: false,
    filterSegmentList: null,
    selectedSegmentIds: [],
    selectChildSegments: false,
    singleSelectionMode: false,
    expandAttributeSegmentList: false,
    popoverAlign: 'center',
    formLabel: null,
    icon: segmentMenuIcon,
    selectFirstSegmentByDefault: false,
    willUpdateStore: false,
  }

  state = {
    filterText: '',
    isPopupOpen: false,
    selectedSegments: {},
  }

  componentDidMount() {
    const { fetchAttributeList, fetchUserList } = this.props;

    fetchAttributeList();
    fetchUserList();

    this.setState({
      selectedSegments: this.selectedSegments,
    }, () => {
      this.handleTargetUserCountChange();
    });
  }

  componentDidUpdate(previousProps) {
    const { selectedSegmentIds, defaultSegmentList, selectFirstSegmentByDefault, userList } = this.props;
    const {
      selectedSegmentIds: previousSelectedSegmentIds,
      defaultSegmentList: previousDefaultSegmentList,
      userList: previousUserList,
    } = previousProps;

    if (this.segmentList.length === 0) {
      return;
    }
    if (this.selectedSegmentsCount === 0 && selectFirstSegmentByDefault) {
      this.handleSelectedSegmentsChange(this.segmentList.slice(0, 1));
    } else if (
      !_.isEqual(selectedSegmentIds, previousSelectedSegmentIds) ||
      !_.isEqual(defaultSegmentList, previousDefaultSegmentList)
    ) {
      this.setState({
        selectedSegments: this.selectedSegments,
      }, () => {
        this.handleTargetUserCountChange();
      });
    } else if (!_.isEqual(userList, previousUserList)) {
      this.handleTargetUserCountChange();
    }
  }

  get segmentList() {
    const { filterSegmentList, defaultSegmentList } = this.props;
    return filterSegmentList ? filterSegmentList(defaultSegmentList) : defaultSegmentList;
  }

  get selectedSegments() {
    const { selectedSegmentIds } = this.props;
    return _.reduce(selectedSegmentIds, (result, segmentId) => {
      const existingSegment = this.segmentList.find(i => i.id === segmentId);
      return existingSegment
        ? { ...result, [segmentId]: existingSegment }
        : result;
    }, {});
  }

  get selectedSegmentsCount() {
    return _.keys(this.selectedSegments).length;
  }

  get filteredSegmentList() {
    const { filterText } = this.state;

    if (filterText) {
      return this.segmentList.filter(segment => (
        fuzzysearch(filterText.toLowerCase(), segment.name.toLowerCase())
      ));
    }

    return this.segmentList;
  }

  get filteredAttributeList() {
    const filteredAttributeList = this.filteredSegmentList.map(segment => segment.attribute);
    return _.uniqBy(filteredAttributeList, attribute => attribute.id);
  }

  get targetUserCount() {
    const { userList } = this.props;
    const { selectedSegments } = this.state;

    return getTargetFilterUserCountFromSegments(_.values(selectedSegments), userList);
  }

  getFilteredSegmentListByAttribute = attribute => this.filteredSegmentList.filter(
    segment => segment.attribute.id === attribute.id,
  );

  updateParentSelectedSegmentList = (shouldClosePopup = false) => {
    const { selectedSegments } = this.state;
    this.handleSelectedSegmentsChange(_.values(selectedSegments));

    if (shouldClosePopup) {
      this.setState({ isPopupOpen: false });
    }
  }

  selectSingleSegment = (segmentToSelect) => {
    this.setState(({ selectedSegments }) => ({
      selectedSegments: {
        ...selectedSegments,
        [segmentToSelect.id]: segmentToSelect,
      },
    }));

    const { selectChildSegments } = this.props;
    if (selectChildSegments) {
      this.selectChildSegments(segmentToSelect);
    }
  }

  deselectSingleSegment = (segmentToDeselect) => {
    this.setState(({ selectedSegments }) => ({
      selectedSegments: _.omit(selectedSegments, [segmentToDeselect.id]),
    }));

    const { selectChildSegments } = this.props;
    if (selectChildSegments) {
      this.deselectChildSegments(segmentToDeselect);
    }
  }

  selectMultipleSegments = (segmentsToSelect) => {
    segmentsToSelect.forEach(segmentToSelect => this.selectSingleSegment(segmentToSelect));
  }

  deselectMultipleSegments = (segmentsToDeselect) => {
    segmentsToDeselect.forEach(segmentToDeselect => this.deselectSingleSegment(segmentToDeselect));
  }

  selectChildSegments = (segment) => {
    const childSegmentsIDs = segment.childSegments || [];
    const childSegmentsMap = {};

    childSegmentsIDs.forEach((childSegmentID) => {
      childSegmentsMap[childSegmentID] = _.find(this.segmentList, s => s.id === childSegmentID);
    });

    this.setState(({ selectedSegments }) => ({
      selectedSegments: {
        ...selectedSegments,
        ...childSegmentsMap,
      },
    }));
  }

  deselectChildSegments = (segment) => {
    const childSegmentsIDs = segment.childSegments || [];

    this.setState(({ selectedSegments }) => ({
      selectedSegments: _.omit(selectedSegments, childSegmentsIDs),
    }));
  }

  selectSegmentInSingleSelectionMode = (segmentToSelect) => {
    this.setState({
      isPopupOpen: false,
      selectedSegments: {
        [segmentToSelect.id]: segmentToSelect,
      },
    }, () => {
      this.updateParentSelectedSegmentList();
    });
  }

  handleFilterTextChange = (value) => {
    this.setState({ filterText: value });
  }

  handleTargetButtonClick = (e) => {
    e && e.stopPropagation && e.stopPropagation();
    this.setState(state => ({ isPopupOpen: !state.isPopupOpen }));
  }

  handlePopoverClickOutside = (e) => {
    e && e.stopPropagation && e.stopPropagation();
    this.setState({ isPopupOpen: false });
  }

  handleCancelButtonClick = () => {
    this.setState({ isPopupOpen: false });
    this.resetSelectedSegments();
  }

  handleConfirmButtonClick = () => {
    this.setState({ isPopupOpen: false });
    this.updateParentSelectedSegmentList();
  }

  handleClearFilterButtonClick = (e) => {
    e && e.stopPropagation && e.stopPropagation();
    this.setState({ filterText: '' });
  }

  handleSegmentSelect = (segmentOrSegmentListToSelect) => {
    const { singleSelectionMode } = this.props;

    if (singleSelectionMode) {
      this.selectSegmentInSingleSelectionMode(segmentOrSegmentListToSelect);
      return;
    }

    if (_.isArray(segmentOrSegmentListToSelect)) {
      this.selectMultipleSegments(segmentOrSegmentListToSelect);
    } else {
      this.selectSingleSegment(segmentOrSegmentListToSelect);
    }
  }

  handleSegmentDeselect = (segmentOrSegmentListToDeselect) => {
    if (_.isArray(segmentOrSegmentListToDeselect)) {
      this.deselectMultipleSegments(segmentOrSegmentListToDeselect);
    } else {
      this.deselectSingleSegment(segmentOrSegmentListToDeselect);
    }
  }

  handleDeselectAllButtonClick = () => {
    this.setState({
      selectedSegments: {},
    }, () => {
      const { singleSelectionMode } = this.props;
      if (singleSelectionMode) {
        this.updateParentSelectedSegmentList(true);
      }
    });
  }

  handlePopupClose = () => {
    this.setState({ isPopupOpen: false });
    this.resetSelectedSegments();
  }

  resetSelectedSegments() {
    this.setState({ selectedSegments: this.selectedSegments });
  }

  handleSelectedSegmentsChange(segments) {
    const { onChange, segmentReportSelectSegment, willUpdateStore } = this.props;
    onChange && onChange(segments);
    this.handleTargetUserCountChange();
    if (willUpdateStore) {
      segmentReportSelectSegment(_.first(segments));
    }
  }

  handleTargetUserCountChange() {
    const { onTargetUserCountChange } = this.props;
    onTargetUserCountChange && onTargetUserCountChange(this.targetUserCount);
  }

  renderPopupContent() {
    const { i18n, singleSelectionMode, expandAttributeSegmentList } = this.props;
    const { filterText, isPopupOpen, selectedSegments } = this.state;
    return (
      <Own.PopupContainer isOpen={isPopupOpen}>
        <Own.PopupHeader>
          <Own.PopupSearchContainer>
            <Own.SearchIcon />
            <InputGroup
              value={filterText}
              placeholder={i18n('Filter.Placeholder')}
              onChange={this.handleFilterTextChange}
            />
            {filterText &&
            <Own.ClearButton onClick={this.handleClearFilterButtonClick} />}
          </Own.PopupSearchContainer>
        </Own.PopupHeader>

        <Own.PopupContent>
          {
            this.filteredAttributeList.map((attribute) => {
              const attributeSegmentList = this.getFilteredSegmentListByAttribute(attribute);
              return (
                <AttributeListItem
                  key={attribute.id}
                  attribute={attribute}
                  segmentList={attributeSegmentList}
                  selectedSegments={selectedSegments}
                  singleSelectionMode={singleSelectionMode}
                  expandAttributeSegmentList={expandAttributeSegmentList}
                  onSegmentSelect={this.handleSegmentSelect}
                  onSegmentDeselect={this.handleSegmentDeselect}
                />
              );
            })
          }
        </Own.PopupContent>

        <Own.PopupFooter>
          <Own.CancelButton
            text={i18n('CancelButton.Text')}
            onClick={this.handleCancelButtonClick}
          />
          {
            singleSelectionMode === false &&
            <Helpers.PullRight>
              <Own.DeselectAllButton
                text={i18n('DeselectAllButton.Text')}
                onClick={this.handleDeselectAllButtonClick}
              />

              <Own.SelectAllButton onClick={this.handleConfirmButtonClick}>
                {i18n('ConfirmButton.Text', { segmentCount: _.keys(selectedSegments).length })}
              </Own.SelectAllButton>
            </Helpers.PullRight>
          }
        </Own.PopupFooter>
      </Own.PopupContainer>
    );
  }

  renderTargetButton() {
    const { i18n, fillContainer, icon, singleSelectionMode } = this.props;
    const { isPopupOpen } = this.state;

    const selectedSegmentsAsArray = _.values(this.selectedSegments);
    const selectedSegment = _.first(selectedSegmentsAsArray) || {
      name: i18n('TargetButton.DefaultTextInSingleSelectionMode'),
      attribute: null,
    };

    const targetButtonTextInMultiSelectionMode = this.selectedSegmentsCount > 0
      ? i18n('TargetButton.Text', { segmentCount: this.selectedSegmentsCount })
      : i18n('TargetButton.DefaultText');

    return (
      <Own.TargetButton fillContainer={fillContainer} onClick={this.handleTargetButtonClick}>
        <Own.TargetButtonContent>
          <Own.TargetIcon source={icon} />
          <Own.TargetButtonText>
            {singleSelectionMode ? selectedSegment.name : targetButtonTextInMultiSelectionMode}
          </Own.TargetButtonText>
          {singleSelectionMode && selectedSegment.attribute &&
          <Own.TargetButtonAttributeName>
            {selectedSegment.attribute.name}
          </Own.TargetButtonAttributeName>}
        </Own.TargetButtonContent>
        <Own.TargetButtonChevron open={isPopupOpen} source={downChevronIcon} />
      </Own.TargetButton>
    );
  }

  renderSelector() {
    const { isPopupOpen } = this.state;
    const { popoverAlign } = this.props;

    return (
      <Popover
        isOpen={isPopupOpen}
        content={this.renderPopupContent()}
        position={PopoverPosition.BOTTOM}
        align={popoverAlign}
        onClickOutside={this.handlePopoverClickOutside}
        onClose={this.handlePopupClose}
      >
        {this.renderTargetButton()}
      </Popover>
    );
  }

  render() {
    if (this.segmentList.length === 0) {
      return <></>;
    }
    const { formLabel } = this.props;

    return formLabel ? (
      <FormGroup label={formLabel}>
        {this.renderSelector()}
      </FormGroup>
    ) : this.renderSelector();
  }
}

function mapStateToProps({ app, auth, attributes, users }) {
  const { attributeList } = attributes;
  const { userList } = users;
  const { segmentsForReportList } = selectors.attributes;
  const reportSegmentList = segmentsForReportList({ auth, attributes });
  const { selectedOrganizationID } = app;

  const defaultSegmentList = getSegmentList(attributeList, true)
    .filter(
      segment => reportSegmentList.indexOf(segment.id) !== -1 &&
        segment.attribute.organization === selectedOrganizationID,
    );
  return {
    defaultSegmentList,
    userList,
  };
}

const ConnectedSegmentSelector = connect(mapStateToProps, {
  ...actions.attributes,
  ...actions.reports,
  ...actions.users,
}, null, { forwardRef: true })(SegmentSelector);

export { ConnectedSegmentSelector as SegmentSelector };
