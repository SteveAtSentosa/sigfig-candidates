import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import * as Models from 'Models';
import { SortMode } from 'Constants';
import { ScreenSizes } from 'utilities/common';

import { SortableTableHeader } from './SortableTableHeader';
import { SortableTableRow } from './SortableTableRow';
import { Commons } from './SortableTable.Components';

class SortableTable extends React.PureComponent {
  static propTypes = {
    hideHeaderOnMobile: PropTypes.bool,
    keyField: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    screenSize: PropTypes.number,
    columns: Models.Common.SortableTableColumns.isRequired,
    items: PropTypes.arrayOf(PropTypes.object),
    rowRenderer: PropTypes.func,
    mobileRowRenderer: PropTypes.func,
    mobileThreshold: PropTypes.number,
    className: PropTypes.string,
    onClickItem: PropTypes.func,
  }

  static defaultProps = {
    items: [],
    hideHeaderOnMobile: false,
    mobileThreshold: ScreenSizes.sm,
  }

  constructor(props) {
    super(props);

    const { items } = props;

    this.state = {
      items,
      currentSortColumn: null,
      currentSortMode: null,
    };
  }

  componentDidUpdate(prevProps) {
    const { items: prevItems } = prevProps;
    const { items: currentItems } = this.props;

    if (prevItems !== currentItems) {
      this.setState({
        items: currentItems,
      });
    }
  }

  get sortedItems() {
    const { columns } = this.props;
    const { items, currentSortColumn, currentSortMode } = this.state;
    const sortedItems = items;

    if (currentSortColumn && currentSortMode) {
      const currentColumn = columns.find(({ key }) => key === currentSortColumn);
      const { key, sortable } = currentColumn;

      if (sortable === true) {
        sortedItems.sort((a, b) => {
          if (a[key] === b[key]) {
            return 0;
          }
          return currentSortMode * (a[key] > b[key] ? 1 : -1);
        });
      } else if (typeof sortable === 'function') {
        sortedItems.sort((a, b) => sortable(a, b, currentSortMode));
      } else if (Array.isArray(sortable)) {
        const getter = sortable[0];
        sortedItems.sort((a, b) => {
          const aValue = getter(a);
          const bValue = getter(b);
          if (aValue === bValue) {
            return 0;
          }
          if (bValue === undefined || bValue === null) {
            return -1;
          }
          return currentSortMode * (aValue > bValue ? 1 : -1);
        });
      }
    }

    return sortedItems;
  }

  handleSortChange = (key) => {
    let { currentSortColumn, currentSortMode } = this.state;

    if (key === currentSortColumn) {
      if (currentSortMode === SortMode.Ascending) {
        currentSortMode = SortMode.Descending;
      } else {
        currentSortMode = SortMode.Ascending;
      }
    } else {
      currentSortColumn = key;
      currentSortMode = SortMode.Ascending;
    }

    this.setState({
      currentSortColumn,
      currentSortMode,
    });
  }

  render() {
    const {
      columns,
      hideHeaderOnMobile,
      rowRenderer,
      mobileRowRenderer,
      mobileThreshold,
      screenSize,
      keyField,
      onClickItem,
      className,
    } = this.props;
    const { currentSortColumn, currentSortMode } = this.state;
    const items = this.sortedItems;

    return (
      <>
        {(!hideHeaderOnMobile || screenSize > mobileThreshold) &&
        <SortableTableHeader
          columns={columns}
          sortColumn={currentSortColumn}
          sortMode={currentSortMode}
          hideHeaderOnMobile={hideHeaderOnMobile}
          onSortChange={this.handleSortChange}
        />
        }
        {
          items.map((item, index) => {
            const key = (keyField && typeof keyField === 'string' ? item[keyField] : keyField(item)) || index;
            return (
              <SortableTableRow
                key={key}
                columns={columns}
                item={item}
                className={className}
                rowRenderer={mobileRowRenderer && screenSize <= mobileThreshold ? mobileRowRenderer : rowRenderer}
                onClick={onClickItem ? () => onClickItem(item) : null}
              />
            );
          })
        }
      </>
    );
  }
}

const mapStateToProps = ({ app }) => {
  const { screenSize } = app;

  return {
    screenSize,
  };
};

const ConnectedSortableTable = connect(mapStateToProps)(SortableTable);

export { ConnectedSortableTable as SortableTable, Commons as SortableTableCommons };
