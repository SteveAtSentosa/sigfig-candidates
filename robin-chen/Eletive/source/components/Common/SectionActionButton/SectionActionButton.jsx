import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { plusCircleIcon, downChevronIcon } from 'images/icons/common';

import { Button } from '../Button/Button';
import { SvgImage } from '../SvgImage/SvgImage';


const StyledButton = styled(Button)`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 40px;
  padding: 0 24px;
  border: 1px solid transparent;
  border-radius: 20px;
  color: white;
  background-color: #f68e7e;
  box-shadow: 0px 4px 11px rgba(246, 142, 126, 0.58);
  font-size: 12px;
  font-weight: 600;
  line-height: 18px;
  letter-spacing: .1em;
  transition: all .25s;

  &:focus {
    border: 1px solid #c85443;
  }

  &:hover {
    background-color: #ed7f6e;
  }

  &:active {
    background-color: #e77564;
  }

  &:disabled {
    opacity: .6;
  }

  @media screen and (max-width: 768px) {
    height: 32px;
    padding: 0 18px;
    border-radius: 16px;
    font-size: 9px;
    line-height: 13px;
  }
`;

const PlusIcon = styled(SvgImage)`
  width: 16px;
  height: 16px;
  margin-right: 8px;

  @media screen and (max-width: 768px) {
    width: 12px;
    height: 12px;
    margin-right: 6px;
  }
`;

const DownIconWrapper = styled.div`
  height: 40px;
  display: flex;
  align-items: center;
  margin-left: 16px;
  padding-left: 16px;
  border-left: 1px solid rgba(255, 255, 255, .2);

  @media screen and (max-width: 768px) {
    height: 32px;
    margin-left: 12px;
    padding-left: 12px;
  }
`;

const DownIcon = styled(SvgImage)`
  width: 14px;
  stroke: white;

  @media screen and (max-width: 768px) {
    width: 10px;
  }
`;

class SectionActionButton extends React.PureComponent {
  static propTypes = {
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    dropdown: PropTypes.bool,
    disabled: PropTypes.bool,
    onClick: PropTypes.func,
  }

  static defaultProps = {
    title: '',
    dropdown: false,
    disabled: false,
  }

  render() {
    const { title, dropdown, disabled, onClick } = this.props;

    return (
      <StyledButton
        disabled={disabled}
        data-cy="SectionActionSubmit"
        onClick={onClick}
      >
        <PlusIcon source={plusCircleIcon} />
        { title }
        {
          dropdown &&
          <DownIconWrapper>
            <DownIcon source={downChevronIcon} />
          </DownIconWrapper>
        }
      </StyledButton>
    );
  }
}

export { SectionActionButton };
