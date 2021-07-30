import React from 'react';
import PropTypes from 'prop-types';

import { withTranslation } from 'utilities/decorators';
import { fuzzyFilterSortList } from 'utilities/lists';
import { InputGroup } from 'Components/Common';

import * as Own from './List.Components';

@withTranslation('SelectList')
class List extends React.Component {
  static propTypes = {
    items: PropTypes.arrayOf(PropTypes.any).isRequired,
    activeItem: PropTypes.any,
    idField: PropTypes.string,
    filterable: PropTypes.bool,
    onItemSelect: PropTypes.func,
    itemRenderer: PropTypes.func,
    itemFilter: PropTypes.func,
    hasEmpty: PropTypes.bool,
  };

  static defaultProps = {
    filterable: false,
    hasEmpty: false,
    idField: 'id',
  }

  constructor(props) {
    super(props);

    this.state = {
      filterQuery: '',
    };
  }

  get filteredItems() {
    const { items, filterable, itemFilter } = this.props;
    const { filterQuery } = this.state;
    if (!filterable || !filterQuery) {
      return items;
    }
    if (itemFilter) {
      return items.filter(item => itemFilter(item, filterQuery));
    }
    return fuzzyFilterSortList(items, filterQuery, item => item.title);
  }

  defaultItemRenderer = (item) => {
    if (item.icon) {
      return (
        <>
          <Own.ItemIcon source={item.icon} />
          {item.title}
        </>
      );
    }
    return item.title;
  }

  renderItem = (item, index) => {
    const { onItemSelect, activeItem, idField, itemRenderer, i18n } = this.props;
    const isSelected = activeItem && item &&
      (activeItem === item || (item[idField] && activeItem[idField] === item[idField]));

    let itemContent;

    if (item) {
      itemContent = itemRenderer ? itemRenderer(item) : this.defaultItemRenderer(item);
    } else {
      itemContent = i18n('RemoveActive.Text');
    }

    const dataCy = (item && item['data-cy']) ? item['data-cy'] : 'list-item';

    return (
      <Own.ItemContainer
        key={item?.id || index}
        isSelected={isSelected}
        data-cy={dataCy}
        onClick={(e) => {
          item && item.onClick && item.onClick(item);
          onItemSelect && onItemSelect(item);
          e && e.stopPropagation && e.stopPropagation();
        }}
      >
        {itemContent}
      </Own.ItemContainer>
    );
  }

  renderEmptyListMessage = () => {
    const { i18n } = this.props;

    return <Own.NoResultsContainer>{i18n('NoResults.Text')}</Own.NoResultsContainer>;
  }

  handleChangeFilter = (filterQuery) => {
    this.setState({ filterQuery });
  }

  renderList() {
    const { hasEmpty } = this.props;
    const { filteredItems } = this;
    let list;

    if (filteredItems.length !== 0) {
      list = filteredItems.map((item, index) => this.renderItem(item, index));
      hasEmpty && list.unshift(this.renderItem(null, -1));
    } else {
      list = this.renderEmptyListMessage();
    }

    return list;
  }

  render() {
    const { filterable } = this.props;

    return (
      <>
        {
          filterable &&
          <Own.InputContainer>
            <Own.SearchIcon />
            <InputGroup onChange={this.handleChangeFilter} />
          </Own.InputContainer>
        }
        <Own.Container>
          {this.renderList()}
        </Own.Container>
      </>
    );
  }
}

export { List };
