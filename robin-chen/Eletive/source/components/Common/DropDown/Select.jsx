import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { withTranslation } from 'utilities/decorators';
import { downChevronIcon } from 'images/icons/common';
import { FormButton, TargetPopover, List } from 'Components/Common';

const StyledFormButton = styled(FormButton)`
  text-align: left;
`;

@withTranslation('SelectList')
class Select extends React.PureComponent {
  static propTypes = {
    items: PropTypes.arrayOf(PropTypes.any),
    activeItem: PropTypes.any,
    idField: PropTypes.string,
    filterable: PropTypes.bool,
    hasEmpty: PropTypes.bool,
    small: PropTypes.bool,
    minimal: PropTypes.bool,
    placeholder: PropTypes.string,
    onItemSelect: PropTypes.func,
    labelRenderer: PropTypes.func,
    itemRenderer: PropTypes.func,
    itemFilter: PropTypes.func,
  }

  static defaultProps = {
    filterable: false,
    hasEmpty: false,
    small: false,
    minimal: false,
    idField: 'id',
  }

  get label() {
    const { items, idField, labelRenderer, activeItem, itemRenderer, i18n, placeholder } = this.props;

    if (activeItem) {
      if (labelRenderer) {
        return labelRenderer(activeItem);
      }
      if (itemRenderer) {
        return itemRenderer(activeItem);
      }
      const item = items.find(e => e[idField] === activeItem[idField]);
      if (item) {
        return item.title;
      }
    }

    return placeholder || i18n('NoActive.Text');
  }

  renderList = ({ closePopup }) => {
    const { items, activeItem, idField, hasEmpty, itemFilter,
      itemRenderer, filterable, onItemSelect } = this.props;

    return (
      <List
        activeItem={activeItem}
        items={items}
        idField={idField}
        filterable={filterable}
        itemFilter={itemFilter}
        itemRenderer={itemRenderer}
        hasEmpty={hasEmpty}
        onItemSelect={(item) => {
          onItemSelect && onItemSelect(item);
          closePopup();
        }}
        onClose={this.handleToggle}
      />
    );
  }

  render() {
    const { small, minimal } = this.props;

    // TODO Inline button for minimal
    return (
      <TargetPopover
        minWidthByTarget
        contentRenderer={this.renderList}
      >
        <StyledFormButton fullWidth small={small} minimal={minimal} rightIcon={downChevronIcon} text={this.label} />
      </TargetPopover>
    );
  }
}

export { Select };
