import React from 'react';
import PropTypes from 'prop-types';

import { getUpdatedState } from 'utilities/state';
import { withTranslation } from 'utilities/decorators';

import * as Models from 'Models';

import {
  FormActions,
  FormGroup,
  InputGroup,
  Label,
  RoundedButtonIntent,
  Toggle,
} from 'Components/Common';

import * as Own from './AttributeEditForm.Components';

@withTranslation('AttributeEditForm')
class AttributeEditForm extends React.PureComponent {
  static propTypes = {
    attribute: Models.Attribute.Attribute.isRequired,
    onCancel: PropTypes.func.isRequired,
    onAttributeUpdate: PropTypes.func.isRequired,
    onAttributeChange: PropTypes.func.isRequired,
    setPreventNavigation: PropTypes.func.isRequired,
  }

  state = {
    attribute: {},
    isAttributeValid: true,
  }

  componentDidMount() {
    const { attribute } = this.props;
    this.setState({ attribute });
  }

  static getDerivedStateFromProps(props, state) {
    const { attribute: nextAttribute } = props;
    const { attribute: currentAttribute } = state;

    if (currentAttribute.id !== nextAttribute.id) {
      return {
        attribute: nextAttribute,
      };
    }

    return null;
  }

  get formActions() {
    const { i18n } = this.props;
    return [
      {
        onClick: this.handleCancelButtonClick,
        children: i18n('CancelButton.Text'),
        isInline: true,
      },
      {
        onClick: this.handleSaveButtonClick,
        children: i18n('SaveButton.Text'),
        intent: RoundedButtonIntent.SUCCESS,
      },
    ];
  }


  setAttributeField = (name, value) => {
    const { onAttributeChange } = this.props;
    onAttributeChange();

    return new Promise((resolve) => {
      this.setState(({ attribute }) => ({
        attribute: getUpdatedState(attribute, name, value),
      }), resolve);
    });
  }


  handleAttributeNameChange = (value) => {
    this.setAttributeField('name', value);
  }

  handleOptionChange = name => (checked) => {
    this.setAttributeField(name, checked);
  }

  handleSaveButtonClick = () => {
    const { isAttributeValid } = this.state;
    if (isAttributeValid === false) {
      return;
    }

    const { onAttributeUpdate } = this.props;
    const { attribute } = this.state;
    onAttributeUpdate(attribute);
  }

  handleCancelButtonClick = () => {
    const { setPreventNavigation, onCancel } = this.props;
    setPreventNavigation(false);
    onCancel();
  }


  render() {
    const { i18n } = this.props;

    const {
      attribute: currentAttribute,
    } = this.state;

    return (
      <Own.Container>
        <FormGroup
          label={i18n('Fields.Name.Label')}
        >
          <InputGroup
            value={currentAttribute.name}
            onChange={this.handleAttributeNameChange}
          />
        </FormGroup>

        <Own.ToggleWrapper>
          <Toggle
            checked={currentAttribute.allowAsFilterInReport}
            onChange={this.handleOptionChange('allowAsFilterInReport')}
          />
          <Label
            inline
            label={i18n('Fields.AllowFilter.Label')}
            helpTooltip={i18n('Fields.AllowFilter.Tooltip')}
          />
        </Own.ToggleWrapper>

        <Own.ToggleWrapper>
          <Toggle
            checked={currentAttribute.reportToMembers}
            onChange={this.handleOptionChange('reportToMembers')}
          />
          <Label
            inline
            label={i18n('Fields.SegmentReportMembers.Label')}
            helpTooltip={i18n('Fields.SegmentReportMembers.Tooltip')}
          />
        </Own.ToggleWrapper>


        <FormActions actions={this.formActions} />
      </Own.Container>
    );
  }
}

export { AttributeEditForm };
