import React from 'react';
import PropTypes from 'prop-types';

import { TranslationSelector } from 'Components/Common';

import { i18n } from 'utilities/decorators';
import * as Models from 'Models';

import * as Own from './TranslationList.Components';

export class TranslationList extends React.PureComponent {
  static propTypes = {
    multiline: PropTypes.bool,
    translatedString: Models.Common.I18Content.isRequired,
    onChange: PropTypes.func.isRequired,
  }

  static defaultProps = {
    multiline: false,
  }

  get languageList() {
    const { translatedString } = this.props;
    return Object.keys(translatedString)
      .filter(k => k !== 'en');
  }

  get translationList() {
    const { translatedString } = this.props;
    return this.languageList
      .map(key => ({ key, string: translatedString[key] }));
  }

  handleChangeLanguagesList = (list) => {
    const { onChange, translatedString } = this.props;
    const currentLanguageList = this.languageList;
    list
      .filter(e => !currentLanguageList.includes(e))
      .forEach((e) => {
        translatedString[e] = '';
      });
    currentLanguageList
      .filter(e => !list.includes(e))
      .forEach(e => (delete translatedString[e]));
    onChange({ ...translatedString });
  }

  handleChangeTranslation = (value, language) => {
    const { onChange, translatedString } = this.props;
    translatedString[language] = value;
    onChange({ ...translatedString });
  }

  handleDeleteTranslation = (language) => {
    const { onChange, translatedString } = this.props;
    delete translatedString[language];
    onChange({ ...translatedString });
  }

  render() {
    const { languageList } = this;
    const { multiline } = this.props;
    return (
      <>
        <Own.ButtonContainer haveList={!!languageList.length}>
          <TranslationSelector languageList={languageList} onChange={this.handleChangeLanguagesList} />
        </Own.ButtonContainer>
        {this.translationList.map(item => (
          <Own.TranslateItem
            multiline={multiline}
            key={item.key}
            translate={item.string}
            label={i18n.global(`LanguageList.${item.key}`)}
            onChange={value => this.handleChangeTranslation(value, item.key)}
            onDelete={() => this.handleDeleteTranslation(item.key)}
          />
        ))}
      </>
    );
  }
}
