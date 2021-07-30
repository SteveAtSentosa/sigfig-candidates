import React from 'react';
import PropTypes from 'prop-types';

import { getUpdatedState } from 'utilities/state';
import { withTranslation } from 'utilities/decorators';

import * as Models from 'Models';
import { AttributeTypes } from 'Constants/Attributes';

import { InlineButton } from 'Components/Common';

import { closeDaggerIcon, saveIcon } from 'images/icons/common';
import {
  DatesSubform,
  NumbersSubform,
} from './AttributeEditForm.Subforms';

import * as Own from './AttributeEditForm.Components';

@withTranslation('AttributeEditForm')
class AttributeSegmentsEdit extends React.PureComponent {
  static propTypes = {
    attribute: Models.Attribute.Attribute.isRequired,
    onCancel: PropTypes.func.isRequired,
    onAttributeUpdate: PropTypes.func.isRequired,
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

  setAttributeField = (name, value) => {
    const { setPreventNavigation } = this.props;
    setPreventNavigation(true);

    return new Promise((resolve) => {
      this.setState(({ attribute }) => ({
        attribute: getUpdatedState(attribute, name, value),
      }), resolve);
    });
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

  handleSegmentChange = (segments) => {
    this.setAttributeField('segments', segments);
  }

  handleSegmentListUpdate = (segments, isSegmentListValid) => {
    this.setState({
      isAttributeValid: isSegmentListValid,
    });

    if (isSegmentListValid) {
      this.setAttributeField('segments', segments);
    }
  }

  render() {
    const {
      i18n,
      attribute,
    } = this.props;

    return (
      <>
        <Own.ActionsContainer>
          <InlineButton
            icon={closeDaggerIcon}
            text={i18n('CancelButton.Text')}
            onClick={this.handleCancelButtonClick}
          />
          <InlineButton
            icon={saveIcon}
            text={i18n('SaveButton.Text')}
            onClick={this.handleSaveButtonClick}
          />
        </Own.ActionsContainer>
        <Own.FormSection>
          {attribute.type === AttributeTypes.Dates &&
            <DatesSubform
              key={attribute.id}
              attribute={attribute}
              onSegmentChange={this.handleSegmentChange}
            />
          }

          {attribute.type === AttributeTypes.Numbers &&
            <NumbersSubform
              attribute={attribute}
              onSegmentListUpdate={this.handleSegmentListUpdate}
            />
          }
        </Own.FormSection>
      </>
    );
  }
}

export { AttributeSegmentsEdit };
