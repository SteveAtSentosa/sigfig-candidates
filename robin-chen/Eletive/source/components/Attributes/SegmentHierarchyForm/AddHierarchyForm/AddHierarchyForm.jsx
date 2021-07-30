import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';

import { withTranslation } from 'utilities/decorators';

import * as AttributeModels from 'Models/Attributes';
import { SegmentSelector } from 'Components/Attributes';
import { FormActions, Line, RoundedButtonIntent } from 'Components/Common';

@withTranslation('Attributes/SegmentHierarchyForm.AddHierarchyDialog')
class AddHierarchyForm extends React.PureComponent {
  static propTypes = {
    parentAttribute: AttributeModels.Attribute.isRequired,
    parentAttributePreselectedSegment: AttributeModels.ExtendedSegment,
    onCancel: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired,
  }

  state = {
    selectedParentSegment: null,
    selectedChildSegments: [],
  }

  componentDidMount() {
    const { parentAttributePreselectedSegment } = this.props;

    if (parentAttributePreselectedSegment) {
      this.setState({
        selectedParentSegment: parentAttributePreselectedSegment,
      });
    }
  }

  get formActions() {
    const { i18n, onCancel } = this.props;
    return [
      {
        onClick: onCancel,
        children: i18n('CancelButton.Text'),
        isInline: true,
      },
      {
        onClick: this.handleCreateButtonClick,
        children: i18n('CreateButton.Text'),
        intent: RoundedButtonIntent.SUCCESS,
      },
    ];
  }

  isSegmentContainsChildSegments = segment => (
    Boolean(segment?.childSegments && segment.childSegments.length > 0)
  )

  filterParentSelectorSegmentList = (segmentList) => {
    const { parentAttribute } = this.props;
    return segmentList.filter(segment => segment.attribute.id === parentAttribute.id);
  }

  filterChildSelectorSegmentList = (segmentList) => {
    const { parentAttribute } = this.props;
    const { selectedParentSegment } = this.state;

    const childSegmentList = segmentList
      .filter(segment => segment.attribute.type === 0)
      .filter(segment => segment.attribute.id !== parentAttribute.id);

    if (this.isSegmentContainsChildSegments(selectedParentSegment)) {
      return this.filterOutChildSegments(childSegmentList, selectedParentSegment);
    }

    return childSegmentList;
  }

  handleParentSelectorSegmentSelect = (segments) => {
    const [selectedParentSegment] = segments;
    this.setState({ selectedParentSegment });

    if (this.isSegmentContainsChildSegments(selectedParentSegment)) {
      const { selectedChildSegments } = this.state;

      this.setState({
        selectedChildSegments: this.filterOutChildSegments(selectedChildSegments, selectedParentSegment),
      });
    }
  }

  filterOutChildSegments = (segmentList, segmentToExclude) => (
    _.differenceWith(segmentList, segmentToExclude.childSegments, (segment, childSegmentID) => (
      segment.id === childSegmentID
    ))
  )

  handleChildSelectorSegmentListSelect = (segments) => {
    this.setState({
      selectedChildSegments: segments,
    });
  }

  handleCreateButtonClick = () => {
    const { onConfirm } = this.props;
    const { selectedParentSegment, selectedChildSegments } = this.state;

    onConfirm(selectedParentSegment, selectedChildSegments);
  }

  render() {
    const { i18n } = this.props;
    const { selectedParentSegment, selectedChildSegments } = this.state;
    const selectedChildSegmentIds = selectedChildSegments.map(segment => segment.id);

    return (
      <>
        <SegmentSelector
          expandAttributeSegmentList
          fillContainer
          singleSelectionMode
          selectFirstSegmentByDefault
          formLabel={i18n('ParentSelector.Title')}
          filterSegmentList={this.filterParentSelectorSegmentList}
          selectedSegmentIds={selectedParentSegment ? [selectedParentSegment.id] : []}
          onChange={this.handleParentSelectorSegmentSelect}
        />

        <Line marginBottom={24} marginTop={24} />

        <SegmentSelector
          fillContainer
          formLabel={i18n('ChildSelector.Title')}
          filterSegmentList={this.filterChildSelectorSegmentList}
          selectedSegmentIds={selectedChildSegmentIds}
          onChange={this.handleChildSelectorSegmentListSelect}
        />

        <FormActions actions={this.formActions} />
      </>
    );
  }
}

export { AddHierarchyForm };
