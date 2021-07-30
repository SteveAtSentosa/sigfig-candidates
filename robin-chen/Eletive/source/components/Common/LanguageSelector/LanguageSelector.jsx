import React from 'react';
import PropTypes from 'prop-types';

import { Locales } from 'Constants/index';
import { SingleSelect as Select } from 'Components/Common';

const languageCodes = Object.keys(Locales);
const items = languageCodes.map(languageCode => ({ id: languageCode, title: Locales[languageCode] }));

class LanguageSelector extends React.PureComponent {
  static propTypes = {
    language: PropTypes.string,
    handleLanguageChange: PropTypes.func,
  };

  getActiveItem(languageCode) {
    return items.find(item => item.id === languageCode);
  }

  handleChange = ({ id: languageCode }) => {
    const { handleLanguageChange } = this.props;
    handleLanguageChange(languageCode);
  }

  render() {
    const { language: languageCode } = this.props;
    const activeItem = this.getActiveItem(languageCode);

    return (
      <Select
        items={items}
        activeItem={activeItem}
        onItemSelect={this.handleChange}
      />
    );
  }
}

export { LanguageSelector };
