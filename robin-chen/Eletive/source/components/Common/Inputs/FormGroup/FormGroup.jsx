import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import classnames from 'classnames';

import { Label } from 'Components/Common';
import * as Models from 'Models';

import { Intent } from '../Intent';

const Container = styled.div`
  width: 100%;
  text-align: left;
  margin-bottom: 7px;

  ${props => props.inline && `
    display: flex;
    justify-content: space-between;
  `}

  ${props => props.inlineOnSmallScreen && `
    @media screen and (max-width: 768px) {
      display: flex;
      justify-content: space-between;
      > p {
        flex: 0 0 30%;
        justify-content: flex-start;
       }
       > * {
        flex: 0 0 70%;
      }
    }
  `}

`;

const HelperText = styled.p`
  margin-top: 5px;
  color: #5c7080;
  font-size: 12px;

  &.danger {
    color: #c23030;
  }

  &.success {
    color: #0d8050;
  }

  &.warning {
    color: #bf7326;
  }

  &.primary {
    color: #106ba3;
  }
`;

class FormGroup extends React.PureComponent {
  static propTypes = {
    inline: PropTypes.bool,
    inlineOnSmallScreen: PropTypes.bool,
    label: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.node,
    ]),
    helpTooltip: Models.Common.RenderableElement,
    helperText: PropTypes.string,
    intent: PropTypes.string,
    required: PropTypes.bool,
    children: Models.Common.RenderableElement,
    className: PropTypes.string,
  }

  get helperTextClasses() {
    const { intent } = this.props;

    if (intent === Intent.DANGER) {
      return classnames('danger');
    }
    if (intent === Intent.SUCCESS) {
      return classnames('success');
    }
    if (intent === Intent.WARNING) {
      return classnames('warning');
    }
    return null;
  }

  render() {
    const { label, helpTooltip, className, helperText, required, children, inline, inlineOnSmallScreen } = this.props;

    return (
      <Container className={className} inline={inline} inlineOnSmallScreen={inlineOnSmallScreen}>
        <Label
          required={required}
          label={label}
          helpTooltip={helpTooltip}
          inline={inline}
          inlineOnSmallScreen={inlineOnSmallScreen}
        />
        {children}
        {
          helperText &&
          <HelperText className={this.helperTextClasses}>
            {helperText}
          </HelperText>
        }
      </Container>
    );
  }
}

export { FormGroup };
