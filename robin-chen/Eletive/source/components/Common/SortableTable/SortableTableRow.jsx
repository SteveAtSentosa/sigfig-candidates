import React from 'react';
import PropTypes from 'prop-types';

import * as Models from 'Models';

import * as OwnComponents from './SortableTable.Components';

class SortableTableRow extends React.PureComponent {
  static propTypes = {
    columns: Models.Common.SortableTableColumns.isRequired,
    item: PropTypes.object.isRequired,
    rowRenderer: PropTypes.func,
    onClick: PropTypes.func,
  }

  render() {
    const { columns, item, rowRenderer, onClick } = this.props;

    return (
      <OwnComponents.RowWrapper onClick={onClick} data-cy="SortableTableRow">
        {rowRenderer(item, columns)}
      </OwnComponents.RowWrapper>
    );
  }
}

export { SortableTableRow };
