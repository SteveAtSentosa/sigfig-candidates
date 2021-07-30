import React from 'react';
import styled from 'styled-components';

import { ErrorPopover } from './ErrorPopover';
import { InputGroup } from '../Inputs/InputGroup';

export default {
  title: 'Common|ErrorPopover',

  parameters: {
    component: ErrorPopover,
    componentSubtitle: 'Error popover',
  },
};

const props = {
  content: <div>Popover Content</div>,
  position: 'bottom',
};

export const normal = () => (
  <ErrorPopover {...props}>
    <div>Popover Here</div>
  </ErrorPopover>
);

const propsInputBox = {
  content: <div>Invalid value</div>,
  position: 'right',
  padding: -100,
};
const email = '';

const InputGroupWrapper = styled.div`
  width: 500px;
`;

export const withInputBox = () => (
  <InputGroupWrapper>
    <ErrorPopover {...propsInputBox}>
      <InputGroup
        name="email"
        value={email}
        autoComplete="email"
        onChange={() => {}}
      />
    </ErrorPopover>
  </InputGroupWrapper>
);
