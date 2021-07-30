import React from 'react';
import PropTypes from 'prop-types';

import * as AttributeModels from 'Models/Attributes';

import { AttributeListItem } from './AttributeListItem';
import * as Own from './AttributeList.Components';

class AttributeList extends React.PureComponent {
  static propTypes = {
    attributes: AttributeModels.AttributeList,
    selectedAttribute: AttributeModels.Attribute,
    onAttributeSelect: PropTypes.func,
  }

  handleAttributeListItemClick = attribute => () => {
    const { onAttributeSelect } = this.props;
    onAttributeSelect && onAttributeSelect(attribute);
  }

  isAttributeSelected(attribute) {
    const { selectedAttribute } = this.props;

    return selectedAttribute && selectedAttribute.id === attribute.id;
  }

  render() {
    const { attributes } = this.props;

    return (
      <Own.Container>
        {
          attributes.map((attribute) => {
            const { id, name, type } = attribute;

            return (
              <AttributeListItem
                key={id}
                name={name}
                type={type}
                selected={this.isAttributeSelected(attribute)}
                onClick={this.handleAttributeListItemClick(attribute)}
              />
            );
          })
        }
      </Own.Container>
    );
  }
}

export { AttributeList };
