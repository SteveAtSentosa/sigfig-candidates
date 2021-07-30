import React from 'react';
import PropTypes from 'prop-types';

import * as Models from 'Models';
import { SortMode } from 'Constants';
import { ascendTriangleIcon, descendTriangleIcon } from 'images/icons/common';

import * as OwnComponents from './SortableTable.Components';

class SortableTableHeader extends React.PureComponent {
  static propTypes = {
    columns: Models.Common.SortableTableColumns.isRequired,
    sortColumn: PropTypes.string,
    sortMode: PropTypes.number,
    hideHeaderOnMobile: PropTypes.bool,
    onSortChange: PropTypes.func.isRequired,
  }

  handleSortClick = key => () => {
    const { onSortChange } = this.props;

    onSortChange(key);
  }

  render() {
    const { columns, sortColumn, sortMode, hideHeaderOnMobile } = this.props;

    return (
      <OwnComponents.HeaderWrapper hideHeaderOnMobile={hideHeaderOnMobile}>
        {
          columns.map(({ key, title, style, sortable }) => (
            <OwnComponents.HeaderCell key={key} style={style}>
              <OwnComponents.HeaderCellContent sortable={!!sortable} onClick={!!sortable && this.handleSortClick(key)}>
                <OwnComponents.ColumnTitle>{ title }</OwnComponents.ColumnTitle>
                {
                  !!sortable &&
                  <OwnComponents.SortIcons>
                    <OwnComponents.SortIcon
                      source={ascendTriangleIcon}
                      active={sortColumn === key && sortMode === SortMode.Ascending}
                    />
                    <OwnComponents.SortIcon
                      source={descendTriangleIcon}
                      active={sortColumn === key && sortMode === SortMode.Descending}
                    />
                  </OwnComponents.SortIcons>
                }
              </OwnComponents.HeaderCellContent>
            </OwnComponents.HeaderCell>
          ))
        }
      </OwnComponents.HeaderWrapper>
    );
  }
}

export { SortableTableHeader };
