import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';

import { withTranslation } from 'utilities/decorators';
import { AttributeTypes } from 'Constants/Attributes';
import { Routes } from 'Constants';

import {
  Alert,
  AlertIntent,
  SwitchChoice,
  InputGroup,
  FormActions,
  RoundedButtonIntent,
  FormGroup,
} from 'Components/Common';
import * as AttributeModels from 'Models/Attributes';
import { exclamationIcon } from 'images/icons/common';
import { choiceAttributeIcon, dateAttributeIcon, numberAttributeIcon } from 'images/settings';

import * as Own from './AttributeCreateForm.Components';

@withTranslation('AttributeCreateForm')
class AttributeCreateForm extends React.PureComponent {
  static propTypes = {
    attributeList: AttributeModels.AttributeList,
    onAttributeCreate: PropTypes.func.isRequired,
    onAttributeChange: PropTypes.func.isRequired,
  }

  state = {
    attributeName: '',
    selectedAttributeType: AttributeTypes.Choices,
    sameNameAttributeAlertShown: false,
  }

  constructor(props) {
    super(props);

    this.attributeNameInput = React.createRef();
  }

  componentDidMount() {
    this.attributeNameInput.current.focus();
  }

  get inputPlaceholder() {
    const { i18n } = this.props;
    const { selectedAttributeType } = this.state;

    const placeholderPrefix = i18n('Placeholders.Prefix');
    let attributeNameExample = i18n('Placeholders.Numbers');
    if (selectedAttributeType === AttributeTypes.Choices) {
      attributeNameExample = i18n('Placeholders.Choices');
    } else if (selectedAttributeType === AttributeTypes.Dates) {
      attributeNameExample = i18n('Placeholders.Dates');
    }

    return `${placeholderPrefix} "${attributeNameExample}"`;
  }

  get formActions() {
    const { i18n } = this.props;
    const { attributeName } = this.state;
    return [
      {
        onClick: this.handleCancelButtonClick,
        children: i18n('CancelButton.Text'),
        isInline: true,
      },
      {
        onClick: this.handleFormSubmit,
        children: i18n('SubmitButton.Text'),
        disabled: attributeName.trim() === '',
        intent: RoundedButtonIntent.SUCCESS,
      },
    ];
  }

  isAttributeWithSameNameExists = (attributeName) => {
    const { attributeList } = this.props;
    return attributeList.some(attribute => (
      attribute.name.toLowerCase() === attributeName.trim().toLowerCase()
    ));
  }

  handleAttributeTypeChange = (type) => {
    this.setState({
      selectedAttributeType: type,
    });

    this.attributeNameInput.current.focus();
  }

  handleAttributeNameChange = (attributeName) => {
    this.setState({ attributeName });

    const { onAttributeChange } = this.props;
    onAttributeChange();
  }

  handleFormSubmit = (event) => {
    event.preventDefault();

    const { attributeName } = this.state;
    if (attributeName === '') {
      return;
    }

    if (this.isAttributeWithSameNameExists(attributeName)) {
      this.setState({
        sameNameAttributeAlertShown: true,
      });

      return;
    }

    const { onAttributeCreate } = this.props;
    const { selectedAttributeType } = this.state;
    onAttributeCreate(attributeName, selectedAttributeType);
  }

  handleCancelButtonClick = () => {
    const { history } = this.props;
    history.push(Routes.Settings.Attributes.Base);
  }

  handleWarningAlertClose = () => {
    this.setState({
      sameNameAttributeAlertShown: false,
    });

    this.attributeNameInput.current.focus();
  }

  render() {
    const { i18n } = this.props;
    const { attributeName, selectedAttributeType, sameNameAttributeAlertShown } = this.state;

    const choices = [
      {
        value: AttributeTypes.Choices,
        title: i18n('Titles.Choices'),
        icon: choiceAttributeIcon,
        description: i18n('Descriptions.Choices'),
      },
      {
        value: AttributeTypes.Dates,
        title: i18n('Titles.Dates'),
        icon: dateAttributeIcon,
        description: i18n('Descriptions.Dates'),
      },
      {
        value: AttributeTypes.Numbers,
        title: i18n('Titles.Numbers'),
        icon: numberAttributeIcon,
        description: i18n('Descriptions.Numbers'),
      },
    ];

    return (
      <Own.Container>
        <SwitchChoice
          choices={choices}
          value={selectedAttributeType}
          onChange={this.handleAttributeTypeChange}
        />

        <Own.FormContainer>
          <FormGroup label={i18n('InputName.Label')}>
            <InputGroup
              value={attributeName}
              inputRef={this.attributeNameInput}
              placeholder={this.inputPlaceholder}
              onChange={this.handleAttributeNameChange}
            />
          </FormGroup>
        </Own.FormContainer>
        <FormActions actions={this.formActions} />

        <Alert
          isOpen={sameNameAttributeAlertShown}
          intent={AlertIntent.DANGER}
          title={<b>{i18n('Warnings.SameNameAttributeTitle')}</b>}
          description={i18n('Warnings.SameNameAttribute')}
          icon={exclamationIcon}
          onClose={this.handleWarningAlertClose}
        />
      </Own.Container>
    );
  }
}

const AttributeCreateFormWithRouter = withRouter(AttributeCreateForm);
export { AttributeCreateFormWithRouter as AttributeCreateForm };
