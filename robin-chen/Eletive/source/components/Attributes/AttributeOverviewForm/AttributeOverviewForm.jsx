import React from 'react';
import PropTypes from 'prop-types';

import { withTranslation } from 'utilities/decorators';
import { choiceAttributeIcon, numberAttributeIcon, dateAttributeIcon } from 'images/settings';
import { addIcon, applyIcon, deleteBinIcon, editIcon, segmentsIcon, thumbUpIcon } from 'images/icons/common';

import * as Models from 'Models/index';
import { AttributeTypes } from 'Constants/Attributes';

import {
  DeleteConfirmationDialog,
  FormGroup,
  InlineButton,
  InputGroup,
  Line,
  SearchBox,
  SidePanel,
  Tabs,
  TargetPopover,
} from 'Components/Common';
import {
  AttributeEditForm,
  AttributeSegmentList,
  AttributeSegmentsEdit,
  SegmentHierarchyForm,
} from 'Components/Attributes';
import * as Own from './AttributeOverviewForm.Components';

@withTranslation('Attributes/AttributeOverviewForm')
class AttributeOverviewForm extends React.PureComponent {
  static propTypes = {
    attribute: Models.Attribute.Attribute.isRequired,
    onAttributeDelete: PropTypes.func.isRequired,
    onAttributeUpdate: PropTypes.func.isRequired,
    onAttributeChange: PropTypes.func.isRequired,
    setPreventNavigation: PropTypes.func.isRequired,
  }

  state = {
    selectedMenuTabID: 'segments',
    confirmDeleteDialogShown: false,
    segmentsEdit: false,
    segmentsFilterText: '',
    newSegmentName: '',
    showAttributeEdit: false,
  }

  componentDidUpdate(prevProps) {
    const { attribute } = this.props;
    if (attribute?.id !== prevProps.attribute?.id) {
      this.setState({
        selectedMenuTabID: 'segments',
        segmentsFilterText: '',
        segmentsEdit: false,
        showAttributeEdit: false,
      });
    }
  }

  get tabs() {
    const { i18n } = this.props;
    return [
      {
        id: 'segments',
        title: i18n('Menu.Segments'),
      },
      {
        id: 'hierarchies',
        title: i18n('Menu.Hierarchies'),
      },
    ];
  }

  get shouldRenderMenu() {
    const { attribute } = this.props;
    return attribute.type === AttributeTypes.Choices;
  }

  get reportToMembersFlagText() {
    const { i18n, attribute } = this.props;
    return attribute.reportToMembers ? i18n('Flags.SegmentReportMembers.On') : i18n('Flags.SegmentReportMembers.Off');
  }

  get allowAsFilterFlagText() {
    const { i18n, attribute } = this.props;
    return attribute.allowAsFilterInReport ? i18n('Flags.AllowFilter.On') : i18n('Flags.AllowFilter.Off');
  }

  handleMenuTabChange = (menuTabID) => {
    this.setState({
      selectedMenuTabID: menuTabID,
    });
  }

  handleEditClick = () => {
    this.setState({ showAttributeEdit: true });
  }

  handleAttributeEditCancel = () => {
    this.setState({ showAttributeEdit: false });
  }

  handleDeleteButtonClick = () => {
    this.setState({ confirmDeleteDialogShown: true });
  }

  handleAttributeCancelDelete = () => {
    this.setState({ confirmDeleteDialogShown: false });
  }

  handleAttributeConfirmDelete = () => {
    const { onAttributeDelete, attribute } = this.props;

    onAttributeDelete(attribute)
      .then(() => {
        this.setState({ confirmDeleteDialogShown: false });
      });
  }

  handleSearchChange = (segmentsFilterText) => {
    this.setState({ segmentsFilterText });
  }

  handleSegmentsEditClick = () => {
    this.setState({ segmentsEdit: true });
  }

  handleSegmentsEditCancel = () => {
    this.setState({ segmentsEdit: false });
  }

  handleNewSegmentNameChange = (newSegmentName) => {
    this.setState({ newSegmentName });
  }

  handleChoiceSegmentCreate = (closePopup) => {
    const { attribute, onAttributeUpdate } = this.props;
    const { segments } = attribute;
    const { newSegmentName: name } = this.state;

    const maxCurrentSegmentValue = segments.length ? Math.max(...segments.map(e => e.value)) : 0;

    const updatedSegmentList = [...segments, {
      name,
      value: maxCurrentSegmentValue + 1,
      valueUpTo: maxCurrentSegmentValue + 1,
    }];

    onAttributeUpdate({ ...attribute, segments: updatedSegmentList })
      .then(() => {
        closePopup();
        this.setState({ newSegmentName: '' });
      });
  }

  renderSegmentsListPanel = () => {
    const { i18n, attribute } = this.props;
    const { segmentsFilterText } = this.state;

    if (attribute.type === AttributeTypes.Choices) {
      return (
        <>
          <SearchBox value={segmentsFilterText} onChange={this.handleSearchChange} />
          <TargetPopover contentRenderer={this.renderAddChoiceSegment}>
            <InlineButton
              icon={addIcon}
              text={i18n('SegmentListPanel.AddChoice', { attributeName: attribute.name })}
              onClick={this.handleSegmentsEditClick}
            />
          </TargetPopover>
        </>
      );
    }

    const text = {
      [AttributeTypes.Numbers]: i18n('SegmentListPanel.EditNumber'),
      [AttributeTypes.Dates]: i18n('SegmentListPanel.EditDates'),
    }[attribute.type];

    return (
      <>
        <div />
        <InlineButton icon={editIcon} text={text} onClick={this.handleSegmentsEditClick} />
      </>
    );
  }

  renderAddChoiceSegment = ({ closePopup }) => {
    const { i18n } = this.props;
    const { newSegmentName } = this.state;
    return (
      <>
        <FormGroup label={i18n('NewChoiceSegment.NameLabel')}>
          <InputGroup
            value={newSegmentName}
            onChange={this.handleNewSegmentNameChange}
            onKeyDown={({ key }) => key === 'Enter' && this.handleChoiceSegmentCreate(closePopup)}
          />
        </FormGroup>
        <Own.NewChoicePopoverFooter>
          <InlineButton
            icon={applyIcon}
            text={i18n('NewChoiceSegment.AddButton')}
            onClick={() => this.handleChoiceSegmentCreate(closePopup)}
          />
        </Own.NewChoicePopoverFooter>
      </>
    );
  }

  render() {
    const { i18n, attribute, onAttributeUpdate, onAttributeChange, setPreventNavigation } = this.props;
    const {
      selectedMenuTabID,
      confirmDeleteDialogShown,
      segmentsFilterText,
      segmentsEdit,
      showAttributeEdit,
    } = this.state;

    const icon = {
      [AttributeTypes.Choices]: choiceAttributeIcon,
      [AttributeTypes.Dates]: dateAttributeIcon,
      [AttributeTypes.Numbers]: numberAttributeIcon,
    }[attribute.type];

    return (
      <>
        <Own.TitleContainer>
          <Own.TitleWrapper>
            <Own.Icon source={icon} />
            {attribute.name}
          </Own.TitleWrapper>
          <Own.TittleButtonsWrapper>
            <InlineButton
              icon={editIcon}
              text={i18n('EditButton.Text')}
              onClick={this.handleEditClick}
            />
            <InlineButton
              icon={deleteBinIcon}
              text={i18n('DeleteButton.Text')}
              onClick={this.handleDeleteButtonClick}
            />
          </Own.TittleButtonsWrapper>
        </Own.TitleContainer>
        <Own.FlagWrapper>
          <Own.ViewFlag icon={thumbUpIcon} text={this.allowAsFilterFlagText} />
          <Own.ViewFlag icon={segmentsIcon} text={this.reportToMembersFlagText} />
        </Own.FlagWrapper>
        {this.shouldRenderMenu &&
        <Own.MenuContainer>
          <Tabs
            tabs={this.tabs}
            selectedTabId={selectedMenuTabID}
            onChange={this.handleMenuTabChange}
          />
          <Line />
        </Own.MenuContainer>
        }
        {selectedMenuTabID === 'segments' &&
        <>
          {!segmentsEdit &&
          <>
            <Own.SearchBoxContainer>
              {this.renderSegmentsListPanel()}
            </Own.SearchBoxContainer>
            <AttributeSegmentList
              attribute={attribute}
              filterText={segmentsFilterText}
              onAttributeUpdate={onAttributeUpdate}
            />
          </>
          }
          {segmentsEdit &&
            <AttributeSegmentsEdit
              attribute={attribute}
              onCancel={this.handleSegmentsEditCancel}
              onAttributeUpdate={onAttributeUpdate}
              setPreventNavigation={setPreventNavigation}
            />
          }
        </>
        }
        {selectedMenuTabID === 'hierarchies' &&
        <SegmentHierarchyForm attribute={attribute} />
        }

        <DeleteConfirmationDialog
          isOpen={confirmDeleteDialogShown}
          title={i18n.global('AttributeEditForm.DeleteConfirmationDialog.Title',
            { attributeName: attribute.name })}
          onCancelDelete={this.handleAttributeCancelDelete}
          onConfirmDelete={this.handleAttributeConfirmDelete}
        />

        <SidePanel
          isOpen={showAttributeEdit}
          header={i18n('EditAttribute.Header', { attributeName: attribute.name })}
          onClose={this.handleAttributeEditCancel}
        >
          <AttributeEditForm
            attribute={attribute}
            onCancel={this.handleAttributeEditCancel}
            onAttributeUpdate={onAttributeUpdate}
            onAttributeChange={onAttributeChange}
            setPreventNavigation={setPreventNavigation}
          />
        </SidePanel>
      </>
    );
  }
}

export { AttributeOverviewForm };
