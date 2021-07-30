import React from 'react';
import PropTypes from 'prop-types';
import { i18n } from 'utilities/decorators';
import * as OwnComponents from './SearchBox.Components';

const SearchBox = props => (
  <OwnComponents.Container>
    <OwnComponents.Input
      placeholder={i18n.global('Common.CommonComponents.SearchInput.Placeholder')}
      {...props}
      onChange={event => props.onChange && props.onChange(event.target.value, event)}
    />
    <OwnComponents.SearchIcon />
  </OwnComponents.Container>
);

SearchBox.propTypes = {
  value: PropTypes.string,
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
};

export { SearchBox };
