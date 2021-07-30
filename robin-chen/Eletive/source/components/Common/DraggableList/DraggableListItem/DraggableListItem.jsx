import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Draggable } from 'react-beautiful-dnd';
import { SvgImage, Button } from 'Components/Common';
import { dragIcon, closeDaggerIcon } from 'images/icons/common';

const DraggableWrapper = styled.div`
  position: relative;
  width: 100%;
  border: 1px solid #c9d0db;
  border-radius: 5px;

  ${props => props.marginBottom && `
    margin-bottom: ${props.marginBottom}px;
  `}
`;

const DraggableHandler = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 33px;
  padding: 0 12px;
  border-right: 1px solid #c9d0db;
  border-radius: 5px 0 0 5px;
  background-color: white;
`;

const DragIcon = styled(SvgImage).attrs({ source: dragIcon })`
  color: #98a6bc;
  line-height: 0;

  ${props => props.disabled && `
    color: #e5eaf1;
  `}

  svg {
    width: 8px;
  }
`;

const ContentContainer = styled.div`
  margin-left: 33px;
  border-radius: 5px;
  overflow: hidden;
`;

const DeleteDaggerContainer = styled(Button)`
  width: 20px;
  height: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  right: 0;
  top: 0;
  transform: translate(50%, -50%);
  padding: 0;
  color: #707e93;
  background-color: white;
  border: 1px solid #c9d0db;
  border-radius: 10px;
  cursor: pointer;
  outline: 0;

  &:hover {
    color: #354a60;
  }

  &:focus {
    border: 1px solid #66d587;
  }
`;

const DeleteDaggerIcon = styled(SvgImage)`
  display: flex;
  width: 8px;
  height: 8px;
`;

export const Delete = ({ onClick }) => (
  <DeleteDaggerContainer onClick={onClick}>
    <DeleteDaggerIcon source={closeDaggerIcon} />
  </DeleteDaggerContainer>
);

export const DragItemContainer = ({ providedDraggable, marginBottom, item, disabled, onDelete }) => (
  <DraggableWrapper
    {...(providedDraggable ? providedDraggable.draggableProps : {})}
    ref={providedDraggable && providedDraggable.innerRef}
    marginBottom={marginBottom}
  >
    <ContentContainer>
      { item }
    </ContentContainer>
    <DraggableHandler {...(providedDraggable ? providedDraggable.dragHandleProps : {})}>
      <DragIcon disabled={disabled} />
    </DraggableHandler>
    {!disabled && <Delete onClick={onDelete} />}
  </DraggableWrapper>
);

class DraggableListItem extends React.PureComponent {
  static propTypes = {
    disabled: PropTypes.bool,
    id: PropTypes.string.isRequired,
    item: PropTypes.node.isRequired,
    index: PropTypes.number.isRequired,
    marginBottom: PropTypes.number,
    onDelete: PropTypes.func,
  }

  static defaultProps = {
    disabled: false,
    marginBottom: 16,
  }

  render() {
    const { id, index, disabled, item, marginBottom, onDelete } = this.props;

    return (
      <Draggable
        draggableId={id}
        index={index}
        isDragDisabled={disabled}
      >
        {providedDraggable => (
          <DragItemContainer
            item={item}
            disabled={disabled}
            marginBottom={marginBottom}
            providedDraggable={providedDraggable}
            onDelete={onDelete}
          />
        )}
      </Draggable>
    );
  }
}

export { DraggableListItem };
