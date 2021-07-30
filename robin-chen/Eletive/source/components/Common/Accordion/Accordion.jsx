import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import { rightChevronIcon, downChevronIcon } from 'images/icons/common';
import { SvgImage } from '../SvgImage/SvgImage';

const AccordionItem = styled.div`
  margin-top: 5px;
  border: 1px solid ${props => (props.isOpened ? '#c9d0db' : '#e5eaf1')};
  border-radius: 4px;
  overflow: hidden;

  &:first-child {
    margin-top: 0;
  }
`;

const AccordionItemHeader = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 0 10px;
  border: 0;
  border-top-left-radius: 3px;
  border-top-right-radius: 3px;
  cursor: pointer;
  user-select: none;

  ${props => (props.isOpened ? `
    border-bottom: 1px solid #c9d0db;
    background: transparent;
  ` : `
    border-bottom-left-radius: 3px;
    border-bottom-right-radius: 3px;
    background: #e5eaf1;
  `)};
`;

const AccordionItemContent = styled.div`
  display: flex;
  flex-direction: column;
  padding: 5px;
`;

const AccordionItemTitle = styled.p`
  margin: 0;
  color: #707e93;
  font-size: 10px;
  font-weight: 600;
  line-height: 26px;
  letter-spacing: 0.1em;
`;

const IconRightChevron = styled(SvgImage).attrs({
  source: rightChevronIcon,
})`
  display: flex;
  width: 5px;
  height: 9px;
  color: #98a6bc;
`;

const IconDownChevron = styled(SvgImage).attrs({
  source: downChevronIcon,
})`
  display: flex;
  width: 9px;
  height: 5px;
  color: #98a6bc;
`;

class Accordion extends React.Component {
  static propTypes = {
    expandedAll: PropTypes.bool,
    items: PropTypes.arrayOf(PropTypes.shape({
      key: PropTypes.string,
      value: PropTypes.string,
    })).isRequired,
    itemRenderer: PropTypes.func.isRequired,
  };

  static defaultProps = {
    expandedAll: false,
  }

  constructor(props) {
    super(props);

    const { items, expandedAll } = this.props;
    const isOpened = Array(items.length).fill(expandedAll);
    this.state = {
      isOpened,
    };

    this.handleHeaderClick = this.handleHeaderClick.bind(this);
  }

  handleHeaderClick = (index) => {
    const { isOpened } = this.state;
    isOpened[index] = !isOpened[index];
    this.setState({
      isOpened,
    });
  }

  render() {
    const { items, itemRenderer } = this.props;
    const { isOpened } = this.state;

    return (
      <>
        { items.map((item, index) => (
          <AccordionItem key={index} isOpened={isOpened[index]}>
            <AccordionItemHeader isOpened={isOpened[index]} onClick={() => this.handleHeaderClick(index)}>
              <AccordionItemTitle>{item.value}</AccordionItemTitle>
              { !isOpened[index] && <IconRightChevron /> }
              { isOpened[index] && <IconDownChevron /> }
            </AccordionItemHeader>
            { isOpened[index] &&
            <AccordionItemContent>
              { itemRenderer(item.key) }
            </AccordionItemContent> }
          </AccordionItem>
        ))}
      </>
    );
  }
}

export { Accordion };
