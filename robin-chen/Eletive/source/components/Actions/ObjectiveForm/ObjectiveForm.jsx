/* eslint-disable max-lines */
import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import moment from 'moment';
import validator from 'validator';
import { withTranslation } from 'utilities/decorators';

import * as Models from 'Models';
import { actionPublic, actionPrivate } from 'images/actions';
import { addIcon } from 'images/icons/common';
import Actions from 'Constants/Actions';
import { getSegmentList } from 'services/attributes';
import { isUserTargetedWithSegment } from 'services/users';
import {
  DraggableList,
  TextArea,
  FormGroup,
  InputGroup,
  SwitchChoice,
  FormActions,
  PopoverPosition,
  RoundedButtonIntent,
  InlineButton,
  ErrorPopover,
} from 'Components/Common';
import { KeyResultItem, ObjectiveDate } from 'Components/Actions';

import * as OwnComponents from './ObjectiveForm.Components';
import { getEmptyObjective } from './ObjectiveForm.service';
import { ObjectiveParent } from './ObjectiveParent';

@withTranslation('ObjectiveForm')
class ObjectiveForm extends React.PureComponent {
  static propTypes = {
    currentUser: PropTypes.oneOfType([Models.User.User, Models.User.CurrentUser]),
    driverList: PropTypes.arrayOf(PropTypes.any),
    attributeList: Models.Attribute.AttributeList,
    objectiveList: Models.Actions.ObjectiveList,
    language: PropTypes.string,
    selectedOrganizationID: PropTypes.number,
    createObjective: PropTypes.func,
    updateObjective: PropTypes.func,
    deleteObjective: PropTypes.func,
    getSelectedOrganization: PropTypes.func,
    onSubmit: PropTypes.func,
  }

  constructor(props) {
    super(props);

    this.state = {
      objective: getEmptyObjective(props.match, props.selectedOrganizationID),
      errorMessages: {
        objectiveName: '',
      },
    };
    this.objectiveKeyRefs = {};
    this.objectiveParentRef = React.createRef();
  }

  componentDidMount() {
    const { objectiveList } = this.props;
    const objectiveID = this.urlObjectiveID;
    if (objectiveID && objectiveList) {
      const objective = objectiveList.find(e => e.id === objectiveID);
      if (objective) {
        this.setState({ objective: { ...objective } });
        return;
      }
    }

    const { objective: currentObjective } = this.state;
    if (currentObjective.subjectType === Actions.ObjectiveSubjectTypes.User) {
      const { currentUser } = this.props;
      const { organization, id } = currentUser;
      const subject = `${id}`;
      const objective = { ...currentObjective, subject, organization };
      this.setState({ objective });
    }
  }

  componentDidUpdate() {
    const { objectiveList } = this.props;
    const { objective } = this.state;
    const objectiveID = this.urlObjectiveID;

    if (!objectiveID) {
      return;
    }
    if (objectiveID && objectiveID !== objective.id) {
      const newObjective = objectiveList.find(e => e.id === objectiveID);
      if (newObjective) {
        this.setState({ objective: { ...newObjective } });
      }
    }
  }

  get publicPrivateObjective() {
    const { i18n } = this.props;
    const { objective: { subjectType } } = this.state;
    const { ObjectiveSubjectTypes } = Actions;
    const subjectTypeKey = _.keys(ObjectiveSubjectTypes).find(
      key => ObjectiveSubjectTypes[key] === subjectType,
    ) || 'Organization';
    return [
      {
        value: true,
        icon: actionPublic,
        title: i18n('ActionPublic.Text'),
        description: i18n(`ActionPublic.Description.${subjectTypeKey}`),
      },
      {
        value: false,
        icon: actionPrivate,
        title: i18n('ActionPrivate.Text'),
        description: i18n(`ActionPrivate.Description.${subjectTypeKey}`),
      },
    ];
  }

  get nextId() {
    const { objective } = this.state;
    const { objectiveKeys } = objective;

    const lastKey = _.maxBy(objectiveKeys, keyResult => keyResult.id);
    return lastKey ? lastKey.id + 1 : 1;
  }

  get urlSegmentID() {
    const { match } = this.props;
    const { params: { segmentID } } = match;
    return segmentID;
  }

  get urlObjectiveID() {
    const { match } = this.props;
    const { params: { objectiveID } } = match;
    return Number(objectiveID);
  }

  get parentsToAlign() {
    const { currentUser, getSelectedOrganization, attributeList } = this.props;
    const { objective: { subjectType } } = this.state;
    const segmentId = this.urlSegmentID;
    const segmentList = getSegmentList(attributeList, true);
    const isUserObjective = subjectType === Actions.ObjectiveSubjectTypes.User;

    const parentSegments = !isUserObjective ? segmentList
      .filter(({ childSegments }) => childSegments && childSegments.includes(segmentId))
      .reduce((a, c) => a.concat(c), [])
      .map(parentSegment => ({
        ...parentSegment,
        subject: parentSegment.id,
        subjectType: Actions.ObjectiveSubjectTypes.Segment,
      }))
      : [];

    const userSegments = isUserObjective ? segmentList
      .filter(({ attribute, ...segment }) => isUserTargetedWithSegment(attribute, segment)(currentUser))
      .reduce((a, c) => a.concat(c), [])
      .map(segment => ({
        ...segment,
        subject: segment.id,
        subjectType: Actions.ObjectiveSubjectTypes.Segment,
      }))
      : [];

    const parentOrganization = {
      ...getSelectedOrganization(),
      subject: null,
      subjectType: Actions.ObjectiveSubjectTypes.Organization,
    };

    return [parentOrganization, ...parentSegments, ...userSegments];
  }

  get formActions() {
    const { i18n } = this.props;
    const actions = [];

    if (this.urlObjectiveID) {
      actions.push({
        onClick: this.handleDeleteObjective,
        children: i18n('DeleteObjectiveButton.Text'),
        intent: RoundedButtonIntent.DANGER,
        isLeftAligned: true,
      });
    }

    actions.push({
      onClick: this.handleCancelCreateObjective,
      children: i18n('CancelObjectiveButton.Text'),
      isInline: true,
    });

    if (!this.urlObjectiveID) {
      actions.push({
        onClick: this.handleCreateObjective,
        children: i18n('CreateObjectiveButton.Text'),
        intent: RoundedButtonIntent.SUCCESS,
      });
    } else {
      actions.push({
        onClick: this.handleSaveObjective,
        children: i18n('SaveObjectiveButton.Text'),
        intent: RoundedButtonIntent.SUCCESS,
      });
    }
    return actions;
  }

  get objectiveWithUpdatedValue() {
    const { objective } = this.state;
    const { objectiveKeys } = objective;

    const updatedObjectiveKeys = objectiveKeys.map((objectiveKey) => {
      const { minValue, maxValue, value } = objectiveKey;
      const isWithinRange = value && value >= minValue && value <= maxValue;
      const newValue = isWithinRange ? value : minValue;

      return { ...objectiveKey, value: newValue };
    });

    return { ...objective, objectiveKeys: updatedObjectiveKeys };
  }

  get showObjectiveParent() {
    const { objective: { isPublic, subjectType } } = this.state;
    const { User, Segment } = Actions.ObjectiveSubjectTypes;
    const isSegmentOrIndividual = User === subjectType || Segment === subjectType;

    return isPublic && isSegmentOrIndividual;
  }

  renderParentToAlignWith = () => {
    const { objective } = this.state;
    const { objectiveList, i18n } = this.props;

    if (this.showObjectiveParent) {
      return (
        <ObjectiveParent
          ref={this.objectiveParentRef}
          i18n={i18n}
          objective={objective}
          isRequired
          objectiveList={objectiveList}
          parentList={this.parentsToAlign}
          onChange={this.handleSelectParentObjectiveToAlignWith}
        />
      );
    }

    return null;
  }

  handleEditObjectiveName = (value) => {
    const { objective, errorMessages } = this.state;
    const newObjective = { ...objective, name: value };
    const newErrorMessages = {
      ...errorMessages,
      objectiveName: '',
    };
    this.setState({
      objective: newObjective,
      errorMessages: newErrorMessages,
    });
  }

  validateForm = () => {
    const { objective: { name } } = this.state;
    const { i18n } = this.props;
    let isParentValid = true;

    const errorMessages = {
      objectiveName: '',
    };

    const trimmedName = name.trim();
    if (validator.isEmpty(trimmedName)) {
      errorMessages.objectiveName = i18n('ErrorMessages.EmptyObjectiveName');
    }

    if (this.showObjectiveParent) {
      isParentValid = this.objectiveParentRef.current.validateForm();
    }

    const isKeyListValid = _.every(
      this.objectiveKeyRefs,
      objectiveKeyRef => (!objectiveKeyRef.current || objectiveKeyRef.current.validateForm()),
    );

    this.setState({ errorMessages });
    return _.every(errorMessages, field => !field) && isParentValid && isKeyListValid;
  }

  handleSelectParentObjectiveToAlignWith = (parentObjective) => {
    const { objective: currentObjective } = this.state;
    const parent = parentObjective ? parentObjective.id : null;
    const objective = { ...currentObjective, parent };

    this.setState({ objective });
  }

  handleEditObjectiveDescription = (value) => {
    const { objective } = this.state;
    const newObjective = { ...objective, description: value };
    this.setState({ objective: newObjective });
  }

  handleSelectDriver = (driver) => {
    const { objective } = this.state;
    const newObjective = { ...objective, driver: driver === null ? null : driver.id };
    this.setState({ objective: newObjective });
  }

  handleEditStatus = (isPublic) => {
    const { objective, parentObjective } = this.state;
    const newObjective = { ...objective,
      isPublic,
      parent: !isPublic ? parentObjective : objective.parent,
    };
    this.setState({ objective: newObjective });
  }

  handleEditDate = ([startAtDate, endAtDate]) => {
    const { objective } = this.state;

    const startAt = moment(startAtDate).unix() || null;
    const endAt = moment(endAtDate).unix() || null;

    const newObjective = {
      ...objective,
      startAt,
      endAt,
    };

    this.setState({ objective: newObjective });
  }

  handleChangeKeyResult = (editedKeyResult, index) => {
    const { objective } = this.state;
    const { objectiveKeys } = objective;

    const newKeyResults = [...objectiveKeys];
    newKeyResults[index] = editedKeyResult;
    const newObjective = { ...objective, objectiveKeys: newKeyResults };
    this.setState({ objective: newObjective });
  }

  handleAddKeyResult = () => {
    const { objective } = this.state;
    const { objectiveKeys } = objective;
    const newKeyResult = {
      id: this.nextId,
      name: '',
      type: 0,
      value: 0,
      minValue: 0,
      maxValue: 100,
    };

    const newObjective = { ...objective, objectiveKeys: [...objectiveKeys, newKeyResult] };
    this.setState({ objective: newObjective });
  }

  handleDragEnd = (newKeyResults) => {
    const { objective } = this.state;
    const newObjective = { ...objective, objectiveKeys: newKeyResults };
    this.setState({ objective: newObjective });
  }

  handleCancelCreateObjective = () => {
    const { history } = this.props;
    history.goBack();
  }

  handleDeleteObjective = () => {
    const { objective } = this.state;

    const { deleteObjective, onSubmit } = this.props;
    deleteObjective(objective);
    onSubmit && onSubmit(objective);
  }

  handleCreateObjective = () => {
    const isFormValid = this.validateForm(true);

    if (!isFormValid) {
      return;
    }
    const objective = this.objectiveWithUpdatedValue;
    const { createObjective, onSubmit } = this.props;

    createObjective(objective);
    onSubmit && onSubmit(objective);
  }

  handleSaveObjective =() => {
    const isFormValid = this.validateForm(true);

    if (!isFormValid) {
      return;
    }
    const objective = this.objectiveWithUpdatedValue;
    const { updateObjective, onSubmit } = this.props;

    updateObjective(objective);
    onSubmit && onSubmit(objective);
  }

  setObjectiveKeyRef = (ref, index) => {
    this.objectiveKeyRefs[index] = { current: ref };
  }

  renderKeyResults() {
    const { objective } = this.state;
    const { objectiveKeys } = objective;
    const canDelete = objectiveKeys.length > 1;

    const objectiveKeysList = objectiveKeys.map((keyResult, index) => ({
      id: `${index}`,
      itemValue: keyResult,
      item: (
        <KeyResultItem
          ref={ref => this.setObjectiveKeyRef(ref, index)}
          key={index}
          keyResult={keyResult}
          index={index}
          onChange={this.handleChangeKeyResult}
        />
      ),
    }));

    return <DraggableList
      listItems={objectiveKeysList}
      itemMarginBottom={30}
      onDragEnd={this.handleDragEnd}
      disabled={!canDelete}
    />;
  }

  render() {
    const { i18n, driverList, language } = this.props;
    const { objective, errorMessages } = this.state;
    const isEditing = Boolean(this.urlObjectiveID);
    return (
      <form>
        <OwnComponents.CreateActionTitle>
          {i18n(isEditing ? 'EditObjectiveTitle' : 'CreateObjectiveTitle')}
        </OwnComponents.CreateActionTitle>

        <OwnComponents.FormGroupWrapper>
          <FormGroup label={i18n('InputName.Label')} required>
            <ErrorPopover
              content={errorMessages.objectiveName}
              position="right"
            >
              <InputGroup
                name="name"
                placeholder={i18n('InputName.Placeholder')}
                value={objective.name}
                onChange={this.handleEditObjectiveName}
              />
            </ErrorPopover>
          </FormGroup>
        </OwnComponents.FormGroupWrapper>

        <OwnComponents.FormGroupWrapper>
          <FormGroup label={i18n('TextArea.Label')}>
            <TextArea
              name="description"
              value={objective.description}
              placeholder={i18n('TextArea.Placeholder')}
              onChange={this.handleEditObjectiveDescription}
            />
          </FormGroup>
        </OwnComponents.FormGroupWrapper>
        <OwnComponents.ObjectiveSelectGroup
          label={i18n('SelectDriver.Label')}
          name="driver"
          hasEmpty
          filterable
          items={driverList.map(item => ({ id: item.id, title: item.getName(language) }))}
          activeItem={{ id: objective.driver }}
          onItemSelect={this.handleSelectDriver}
        />
        <OwnComponents.FormGroupWrapper>
          <SwitchChoice
            value={objective.isPublic}
            disabled={objective.isPublic && isEditing}
            choices={this.publicPrivateObjective}
            onChange={this.handleEditStatus}
          />
        </OwnComponents.FormGroupWrapper>

        {this.renderParentToAlignWith()}

        <OwnComponents.FormGroupWrapper>
          <FormGroup label={i18n('KeyResults.Tittle')} required>
            {this.renderKeyResults()}
          </FormGroup>

          <InlineButton
            onClick={this.handleAddKeyResult}
            text={i18n('AddKeyResultButton.Text')}
            icon={addIcon}
          />
        </OwnComponents.FormGroupWrapper>

        <OwnComponents.FormGroupWrapper>
          <ObjectiveDate
            required
            label={i18n('SelectQuarter.Label')}
            dateRangePosition={PopoverPosition.TOP}
            value={[
              objective.startAt ? moment.unix(objective.startAt) : null,
              objective.endAt ? moment.unix(objective.endAt) : null,
            ]}
            onChange={this.handleEditDate}
          />
        </OwnComponents.FormGroupWrapper>
        <FormActions actions={this.formActions} />
      </form>
    );
  }
}

const WithRouterObjectiveForm = withRouter(ObjectiveForm);
export { WithRouterObjectiveForm as ObjectiveForm };
