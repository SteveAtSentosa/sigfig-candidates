import React from 'react';
import produce from 'immer';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { actions } from 'store/index';
import { areSegmentsEqual, getSegmentList } from 'services/attributes';
import { addIcon, deleteBinIcon, downChevronIcon, plusIcon, rightChevronIcon } from 'images/icons/common';
import { withTranslation } from 'utilities/decorators';
import * as AttributeModels from 'Models/Attributes';

import { ActionMenu, Expandable, InlineButton, PopoverAlign } from 'Components/Common';
import { SegmentIcon } from 'Components/Attributes';
import { AddHierarchyForm } from './AddHierarchyForm/AddHierarchyForm';

import * as Own from './SegmentHiearchyForm.Components';


@withTranslation('Attributes/SegmentHierarchyForm')
class SegmentHierarchyForm extends React.PureComponent {
  static propTypes = {
    attribute: AttributeModels.Attribute.isRequired,
    attributeList: AttributeModels.AttributeList.isRequired,
    updateAttribute: PropTypes.func,
  }

  state = {
    segments: [],
    addHierarchyDialogShown: false,
    preselectedParentSegment: null,
    expanded: {},
  }

  componentDidMount() {
    this.setSegments();
  }

  componentDidUpdate(prevProps) {
    const { attribute } = this.props;
    if (attribute !== prevProps.attribute) {
      this.setSegments();
    }
  }

  setSegments = () => {
    const { attribute } = this.props;
    const segments = getSegmentList([attribute], true)
      .filter(this.isSegmentContainsChildSegments)
      .map(segment => ({
        ...segment,
        childSegments: segment.childSegments
          .map(segmentID => this.getSegmentByID(segmentID))
          .filter(e => !!e) }))
      .filter(e => e.childSegments.length);
    this.setState({ segments });
  }

  showAddHierarchyDialog = (preselectedParentSegment) => {
    this.setState({
      addHierarchyDialogShown: true,
      preselectedParentSegment,
    });
  }

  hideAddHierarchyDialog = () => {
    this.setState({ addHierarchyDialogShown: false });
  }

  isSegmentContainsChildSegments = segment => (
    Boolean(segment?.childSegments && segment.childSegments.length > 0)
  )

  handleAddHierarchyButtonClick = () => {
    this.showAddHierarchyDialog();
  }

  handleAddMoreChildSegmentsButtonClick = parentSegment => () => {
    this.showAddHierarchyDialog(parentSegment);
  }

  handleCancelAddHierarchy = () => {
    this.hideAddHierarchyDialog();
  }

  handleConfirmAddHierarchy = (parentSegment, childSegments) => {
    const { attribute, updateAttribute } = this.props;

    const updatedSegments = produce(attribute.segments, (draft) => {
      const index = draft.findIndex(item => areSegmentsEqual(item, parentSegment));
      const segment = draft[index];
      segment.childSegments = [
        ...parentSegment.childSegments || [],
        ...childSegments,
      ].map(({ id }) => id).filter((e, i, self) => self.indexOf(e) === i);
    });

    updateAttribute({ ...attribute, segments: updatedSegments })
      .then(() => {
        this.hideAddHierarchyDialog();
      });
  }

  handleDeleteChildSegmentButtonClick = (childSegment, parentSegment) => () => {
    const { attribute, updateAttribute } = this.props;

    const updatedSegments = produce(attribute.segments, (draft) => {
      const index = draft.findIndex(item => areSegmentsEqual(item, parentSegment));
      const segment = draft[index];
      segment.childSegments = [
        ...parentSegment.childSegments || [],
      ]
        .map(({ id }) => id)
        .filter((e, i, self) => e !== childSegment.id && self.indexOf(e) === i);
    });

    updateAttribute({ ...attribute, segments: updatedSegments });
  }

  handleExpandAll = () => {
    const { expanded, segments } = this.state;
    const expand = segments.some(({ id }) => !expanded[id]);
    segments.forEach(({ id }) => {
      expanded[id] = expand;
    });
    this.setState({ expanded: { ...expanded } });
  }

  handleHeaderClick = segmentID => () => {
    const { expanded } = this.state;
    expanded[segmentID] = !expanded[segmentID];
    this.setState({ expanded: { ...expanded } });
  }

  getSegmentByID = (segmentID) => {
    const { attributeList } = this.props;

    const segmentList = getSegmentList(attributeList, true);
    return segmentList.find(segment => segment.id === segmentID);
  }

  renderSegment = (segment) => {
    const { i18n } = this.props;
    const { expanded } = this.state;

    const menuActions = [
      {
        title: i18n('AddMoreChildSegmentsButton.Text'),
        icon: plusIcon,
        onClick: this.handleAddMoreChildSegmentsButtonClick(segment),
      },
    ];

    const header = (
      <Own.Header expanded={expanded[segment.id]}>
        <Own.ExpandButtonContainer>
          <InlineButton
            icon={expanded[segment.id] ? downChevronIcon : rightChevronIcon}
            onClick={this.handleHeaderClick(segment.id)}
          />
        </Own.ExpandButtonContainer>
        <SegmentIcon name={segment.name} />
        <Own.SegmentName>{segment.name}</Own.SegmentName>
        <Own.ChildSegmentsCountLabel>
          ({i18n('ChildSegmentsCountLabel', { segmentCount: segment.childSegments.length })})
        </Own.ChildSegmentsCountLabel>
        <Own.ActionContainer>
          <ActionMenu items={menuActions} popoverProps={{ align: PopoverAlign.END }} />
        </Own.ActionContainer>
      </Own.Header>
    );

    return (
      <Expandable
        key={segment.id}
        expanded={expanded[segment.id]}
        header={header}
      >
        {
          segment.childSegments.map(childSegment => (
            <Own.SegmentRow key={childSegment.id}>

              <SegmentIcon name={childSegment.name} />
              <Own.SegmentName>{childSegment.name}</Own.SegmentName>

              <Own.ActionContainer>
                <InlineButton
                  icon={deleteBinIcon}
                  onClick={this.handleDeleteChildSegmentButtonClick(childSegment, segment)}
                  text={i18n('DeleteChildSegmentButton.Text')}
                />
              </Own.ActionContainer>
            </Own.SegmentRow>
          ))
        }
      </Expandable>
    );
  }

  render() {
    const { i18n, attribute, attributeList } = this.props;
    const { addHierarchyDialogShown, preselectedParentSegment, segments } = this.state;

    if (addHierarchyDialogShown || !segments.length) {
      return (
        <>
          <Own.AddHierarchyDialogTitle>
            {i18n('AddHierarchyDialog.Title.Prefix', { name: attribute.name })}
          </Own.AddHierarchyDialogTitle>
          <AddHierarchyForm
            attributeList={attributeList}
            parentAttribute={attribute}
            parentAttributePreselectedSegment={preselectedParentSegment}
            onCancel={this.handleCancelAddHierarchy}
            onConfirm={this.handleConfirmAddHierarchy}
          />
        </>
      );
    }

    return (
      <>
        <Own.TopRow>
          <InlineButton
            icon={plusIcon}
            text={i18n('ExpandButton.Text')}
            onClick={this.handleExpandAll}
          />
          <InlineButton
            icon={addIcon}
            text={i18n('AddHierarchyButton.Text')}
            onClick={this.handleAddHierarchyButtonClick}
          />
        </Own.TopRow>

        <Own.SegmentTree>
          {
            segments.map(segment => this.renderSegment(segment))
          }
        </Own.SegmentTree>
      </>
    );
  }
}

const mapStateToProps = ({ attributes }) => {
  const { attributeList } = attributes;

  return {
    attributeList,
  };
};

const ConnectedSegmentHierarchyForm = connect(
  mapStateToProps, {
    ...actions.attributes,
  },
)(SegmentHierarchyForm);

export { ConnectedSegmentHierarchyForm as SegmentHierarchyForm };
