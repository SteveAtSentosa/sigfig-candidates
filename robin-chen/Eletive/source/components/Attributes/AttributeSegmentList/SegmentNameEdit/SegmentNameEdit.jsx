import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { i18n } from 'utilities/decorators';
import * as Models from 'Models';
import { FormActions, FormGroup, InputGroup, RoundedButtonIntent, SidePanel } from 'Components/Common';

export const Container = styled.div`
padding: 24px;
`;

class SegmentNameEdit extends React.PureComponent {
  static propTypes = {
    segment: Models.Attribute.Segment,
    onChange: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
  }

  state = {
    name: '',
  }

  componentDidMount() {
    const { segment } = this.props;
    if (!segment) {
      return;
    }
    const { name } = segment;
    this.setState({ name });
  }

  componentDidUpdate(prevProps) {
    const { segment } = this.props;

    if (segment && segment !== prevProps.segment) {
      const { name } = segment;
      this.setState({ name });
    }
  }

  get formActions() {
    const { onCancel } = this.props;
    return [
      {
        onClick: onCancel,
        children: i18n.global('AttributeEditForm.CancelButton.Text'),
        isInline: true,
      },
      {
        onClick: this.handleSaveButtonClick,
        children: i18n.global('AttributeEditForm.SaveButton.Text'),
        intent: RoundedButtonIntent.SUCCESS,
      },
    ];
  }

  handleNameChange = (name) => {
    this.setState({ name });
  };

  handleSaveButtonClick = () => {
    const { onChange, segment } = this.props;
    const { name } = this.state;
    onChange(segment, name);
  }

  render() {
    const { segment, onCancel } = this.props;
    const { name } = this.state;
    return (
      <SidePanel
        isOpen={!!segment}
        header={i18n.global('AttributeSegmentList.EditSegmentHeaderText', { name: segment?.name })}
        onClose={onCancel}
      >
        <Container>
          <FormGroup
            label={i18n.global('AttributeEditForm.Fields.Name.Label')}
          >
            <InputGroup
              value={name}
              onChange={this.handleNameChange}
            />
          </FormGroup>

          <FormActions actions={this.formActions} />
        </Container>
      </SidePanel>
    );
  }
}

export { SegmentNameEdit };
