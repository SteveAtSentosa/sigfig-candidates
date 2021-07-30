import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { InlineButton, Label, TextArea, InputGroup } from 'Components/Common';

import { deleteBinIcon } from 'images/icons/common';

export const ButtonContainer = styled.div`
  ${props => props.haveList && `
    margin-bottom: 10px;
  `}
`;

const TranslateItemContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const TranslateItemHeader = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const TranslateItem = ({ multiline, translate, label, onDelete, onChange }) => (
  <TranslateItemContainer>
    <TranslateItemHeader>
      <Label inline label={label} />
      <InlineButton icon={deleteBinIcon} onClick={onDelete} />
    </TranslateItemHeader>
    { multiline && <TextArea value={translate} onChange={onChange} /> }
    { !multiline && <InputGroup value={translate} onChange={onChange} /> }
  </TranslateItemContainer>
);

TranslateItem.propTypes = {
  multiline: PropTypes.bool,
  translate: PropTypes.string,
  label: PropTypes.string,
  onDelete: PropTypes.func,
  onChange: PropTypes.func,
};
