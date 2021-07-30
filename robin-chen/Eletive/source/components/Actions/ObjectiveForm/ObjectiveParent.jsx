import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'utilities/decorators';

import * as Models from 'Models';
import Constants from 'Constants/Actions';

import * as OwnComponents from './ObjectiveForm.Components';

@withTranslation('ObjectiveForm')
class ObjectiveParent extends React.PureComponent {
  static propTypes = {
    objective: Models.Actions.Objective,
    objectiveList: Models.Actions.ObjectiveList,
    parentList: PropTypes.arrayOf(PropTypes.any),
    onChange: PropTypes.func,
    isRequired: PropTypes.bool,
  };

  static defaultProps={
    isRequired: false,
  }

  constructor(props) {
    super(props);

    this.state = {
      parentToAlign: null,
      parentObjective: null,
      errorMessages: {
        parent: '',
      },
    };
  }

  componentDidMount() {
    this.setActiveParent();
  }

  componentDidUpdate(prevProps) {
    const { objective: { id: prevID } } = prevProps;
    const { objective: { id: currentID } } = this.props;

    if (prevID !== currentID) {
      this.setActiveParent();
    }
  }

  get parentObjectives() {
    const { parentToAlign } = this.state;

    if (!parentToAlign) {
      return [];
    }

    const { objectiveList } = this.props;
    const { subjectType } = parentToAlign;
    if (subjectType === Constants.ObjectiveSubjectTypes.Organization) {
      return objectiveList
        .filter(({ isPublic, subjectType: type }) => isPublic && type === Constants.ObjectiveSubjectTypes.Organization);
    }

    const { id: parentSubjectId } = parentToAlign;
    return objectiveList.filter(({ subject, isPublic }) => isPublic && subject === `${parentSubjectId}`);
  }

  setActiveParent() {
    const { objective, objectiveList, parentList } = this.props;
    const { parent } = objective;

    if (parent) {
      const parentObjective = objectiveList.find(({ id }) => id === parent);

      if (!parentObjective) {
        return;
      }

      const { subject, subjectType, organization: orgID } = parentObjective;

      if (subjectType === Constants.ObjectiveSubjectTypes.Organization) {
        const parentToAlign = parentList.find(({ id }) => id === orgID);

        this.setState({ parentToAlign, parentObjective });
      } else {
        const parentToAlign = parentList.find(({ id }) => id === subject);

        this.setState({ parentToAlign, parentObjective });
      }
    }
  }

  handleSelectParentToAlignWith = (parentToAlign) => {
    const parentObjective = null;
    const isParentValid = !parentToAlign;

    this.setState({ parentToAlign, parentObjective });
    this.resetErrorMessage();
    this.handleParentChange(parentObjective, isParentValid);
  }

  handleSelectParentObjectiveToAlignWith = (parentObjective) => {
    this.setState({ parentObjective });
    this.resetErrorMessage();
    this.handleParentChange(parentObjective);
  }

  handleParentChange(parentObjective) {
    const { onChange } = this.props;
    onChange && onChange(parentObjective);
  }

  resetErrorMessage() {
    this.setState({
      errorMessages: { parent: '' },
    });
  }

  validateForm() {
    const { parentObjective, parentToAlign } = this.state;
    const { i18n } = this.props;
    const isParentValid = !parentToAlign || !!parentObjective;
    const errorMessages = {
      parent: '',
    };

    if (!isParentValid) {
      errorMessages.parent = i18n('ErrorMessages.EmptyParentObjective');
    }

    this.setState({ errorMessages });
    return isParentValid;
  }

  render() {
    const { parentList, i18n, isRequired } = this.props;
    const { errorMessages, parentToAlign, parentObjective } = this.state;

    return (
      <>
        <OwnComponents.ObjectiveSelectGroup
          label={i18n('SelectParentToAlignWith.Text')}
          items={parentList}
          activeItem={parentToAlign}
          itemRenderer={item => item.name}
          hasEmpty
          onItemSelect={this.handleSelectParentToAlignWith}
        />
        {
          parentToAlign &&
          <OwnComponents.ObjectiveSelectGroup
            isRequired={isRequired}
            label={i18n('SelectParentObjectiveToAlignWith.Text')}
            items={this.parentObjectives}
            activeItem={parentObjective}
            itemRenderer={item => item.name}
            errorMessages={errorMessages.parent}
            onItemSelect={this.handleSelectParentObjectiveToAlignWith}
          />
        }
      </>
    );
  }
}

export { ObjectiveParent };
