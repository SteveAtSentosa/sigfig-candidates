import React from 'react';
import styled from 'styled-components';

import { FormGroup, SingleSelect as Select, ErrorPopover } from 'Components/Common';

export const FormGroupWrapper = styled.div`
  margin-bottom: 25px;
`;

export const CreateActionTitle = styled.h2`
  margin: 0 0 20px 0;
  font-weight: 600;
  font-size: 14px;
  color: #244986;
`;

export const ObjectiveSelectGroup = (props) => {
  const { items, activeItem, errorMessages, filterSelect, onItemSelect, itemRenderer, filterable,
    labelRenderer, label, isRequired } = props;
  return (
    <FormGroupWrapper>
      <FormGroup
        label={label}
        required={isRequired}
      >
        <ErrorPopover
          content={errorMessages}
        >
          <Select
            filterable={filterable}
            items={items}
            activeItem={activeItem}
            itemRenderer={itemRenderer}
            labelRenderer={labelRenderer}
            hasEmpty
            itemFilter={filterSelect}
            onItemSelect={onItemSelect}
          />
        </ErrorPopover>
      </FormGroup>
    </FormGroupWrapper>
  );
};
