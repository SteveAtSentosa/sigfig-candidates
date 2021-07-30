import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';

import { i18n } from 'utilities/decorators';
import * as AttributeModels from 'Models/Attributes';

import { SegmentListItem } from './SegmentListItem';
import * as Own from './AttributeListItem.Components';

export class AttributeListItem extends React.PureComponent {
  static propTypes = {
    attribute: AttributeModels.Attribute,
    segmentList: AttributeModels.ExtendedSegmentList,
    selectedSegments: AttributeModels.ExtendedSegmentObject,
    singleSelectionMode: PropTypes.bool,
    expandAttributeSegmentList: PropTypes.bool,
    onSegmentSelect: PropTypes.func.isRequired,
    onSegmentDeselect: PropTypes.func.isRequired,
  }

  static defaultProps = {
    singleSelectionMode: false,
    expandAttributeSegmentList: false,
  }

  constructor(props) {
    super(props);

    const { expandAttributeSegmentList } = props;

    this.state = {
      segmentListVisible: expandAttributeSegmentList,
    };
  }

  get segmentCount() {
    const { segmentList } = this.props;
    return segmentList.length;
  }

  get selectedSegmentCount() {
    const { attribute, selectedSegments } = this.props;
    return _.filter(
      selectedSegments,
      segment => segment && segment.attribute && segment.attribute.id === attribute.id,
    ).length;
  }

  get isAllSegmentsSelected() {
    const { segmentList, selectedSegments } = this.props;
    return segmentList.every(segment => selectedSegments[segment.id]);
  }

  handleAttributeClick = () => {
    this.toggleSegmentListVisibility();
  }

  handleSegmentListItemClick = (segment) => {
    const { onSegmentSelect, onSegmentDeselect } = this.props;

    if (this.isSegmentSelected(segment)) {
      onSegmentDeselect(segment);
    } else {
      onSegmentSelect(segment);
    }
  }

  handleToggleSelectAllAttributeSegmentsButtonClick = (event) => {
    event.stopPropagation();

    if (this.isAllSegmentsSelected) {
      const { segmentList, onSegmentDeselect } = this.props;
      onSegmentDeselect(segmentList);
      return;
    }

    const { segmentList, onSegmentSelect } = this.props;
    onSegmentSelect(segmentList);
  }

  isSegmentSelected(segment) {
    const { selectedSegments } = this.props;
    return Boolean(selectedSegments[segment.id]);
  }

  toggleSegmentListVisibility() {
    this.setState(state => ({
      ...state,
      segmentListVisible: !state.segmentListVisible,
    }));
  }

  renderSelectDeselectAllSegmentsButton() {
    const buttonTextTranslationKey = this.isAllSegmentsSelected
      ? 'SegmentSelector.DeselectAllAttributeSegmentsButton.Text'
      : 'SegmentSelector.SelectAllAttributeSegmentsButton.Text';

    return (
      <Own.SelectAllSegmentsButton
        selected={this.isAllSegmentsSelected}
        onClick={this.handleToggleSelectAllAttributeSegmentsButtonClick}
      >
        {i18n.global(buttonTextTranslationKey, { segmentCount: this.segmentCount })}
      </Own.SelectAllSegmentsButton>
    );
  }

  render() {
    const { segmentListVisible } = this.state;
    const { attribute, segmentList, singleSelectionMode } = this.props;
    return (
      <Own.Container>
        <Own.TargetContainer expanded={segmentListVisible} onClick={this.handleAttributeClick}>
          <Own.SegmentName>{attribute.name}</Own.SegmentName>
          <Own.SegmentStats>
            <Own.SegmentCount>
              {
                i18n.global(
                  'SegmentSelector.AttributeSegmentCountLabel',
                  { segmentCount: this.segmentCount },
                )
              }
            </Own.SegmentCount>

            <Own.SelectedSegmentCount>
              ({
                i18n.global(
                  'SegmentSelector.AttributeSelectedSegmentCountLabel',
                  { segmentCount: this.selectedSegmentCount },
                )
              })
            </Own.SelectedSegmentCount>
          </Own.SegmentStats>

          {
            singleSelectionMode === false &&
            this.renderSelectDeselectAllSegmentsButton()
          }

          <Own.CollapseIcon
            revealed={segmentListVisible}
            style={{ marginLeft: singleSelectionMode && 'auto' }}
          />
        </Own.TargetContainer>

        <Own.CollapseContainer open={segmentListVisible}>
          {
            segmentList.map(segment => (
              <SegmentListItem
                key={segment.id}
                segment={segment}
                singleSelectionMode={singleSelectionMode}
                selected={this.isSegmentSelected(segment)}
                onClick={this.handleSegmentListItemClick}
              />
            ))
          }
        </Own.CollapseContainer>
      </Own.Container>
    );
  }
}
