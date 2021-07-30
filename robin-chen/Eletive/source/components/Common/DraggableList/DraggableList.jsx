import React from 'react';
import PropTypes from 'prop-types';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { DraggableListItem } from './DraggableListItem/DraggableListItem';

class DraggableList extends React.PureComponent {
  static propTypes = {
    disabled: PropTypes.bool,
    itemMarginBottom: PropTypes.number,
    listItems: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
      itemValue: PropTypes.object,
      item: PropTypes.node,
    })),
    onDragEnd: PropTypes.func,
    onDelete: PropTypes.func,
  }

  static defaultProps = {
    listItems: [],
  }

  handleDragEnd = ({ destination, source }) => {
    if (!destination) {
      return;
    }

    if (destination.index === source.index) {
      return;
    }

    const { listItems, onDragEnd } = this.props;

    const newListItems = [...listItems];
    const draggedList = newListItems.splice(source.index, 1);
    newListItems.splice(destination.index, 0, ...draggedList);

    onDragEnd && onDragEnd(newListItems.map(item => item.itemValue));
  }

  handleDelete = (index) => {
    const { listItems, onDragEnd, onDelete } = this.props;

    if (onDelete) {
      onDelete(listItems[index].itemValue);
    } else {
      const newListItems = [...listItems];
      newListItems.splice(index, 1);
      onDragEnd && onDragEnd(newListItems.map(e => e.itemValue));
    }
  }

  render() {
    const { listItems, itemMarginBottom, disabled: listDisabled } = this.props;

    return (
      <DragDropContext onDragEnd={this.handleDragEnd}>
        <Droppable droppableId="1">
          {
            provided => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {
                  listItems.map(({ id, item, disabled }, index) => (
                    <DraggableListItem
                      key={id}
                      id={id}
                      index={index}
                      item={item}
                      disabled={listDisabled || disabled}
                      marginBottom={itemMarginBottom}
                      onDelete={() => this.handleDelete(index)}
                    />
                  ))
                }
                { provided.placeholder }
              </div>
            )
          }
        </Droppable>
      </DragDropContext>
    );
  }
}

export { DraggableList };
