import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { MenuItem } from '@blueprintjs/core';

import { i18n } from 'utilities/decorators';

import * as Models from 'Models';

import { Select, MobileMenuItem } from 'Components/Common';

const Link = styled.a.attrs({
  target: '_blank',
  ref: 'noopener noreferrer',
})``;

export class GoogleTranslateLink extends React.PureComponent {
  static propTypes = {
    text: PropTypes.string.isRequired,
    children: Models.Common.RenderableElement,
    fromLanguage: PropTypes.string,
    targetLanguageList: Models.Common.LanguageList.isRequired,
  }

  static defaultProps = {
    fromLanguage: 'en',
  }

  getGoogleTranslateURL = (targetLanguage) => {
    const { text, fromLanguage } = this.props;
    const googleLanguages = {
      nb: 'no',
      zhs: 'zh-CN',
      zht: 'zh-TW',
    };
    const googleTargetLanguage = googleLanguages[targetLanguage] || targetLanguage;
    const googleFromLanguage = googleLanguages[fromLanguage] || fromLanguage;
    return `https://translate.google.com/#${googleFromLanguage}/${googleTargetLanguage}/${text}`;
  }

  handleLinkClick = (event) => {
    event.preventDefault();
  }

  handleLanguageItemSelect = (language) => {
    window.open(this.getGoogleTranslateURL(language), '', 'noopener,noreferrer');
  }

  languageItemRenderer = (language, { handleClick, modifiers }) => (
    <MenuItem
      key={language}
      text={i18n.global(`LanguageList.${language}`)}
      active={modifiers.active}
      onClick={handleClick}
    />
  )

  mobileLanguageItemRenderer = (language, { handleClick }) => (
    <MobileMenuItem key={language} onClick={handleClick}>
      {i18n.global(`LanguageList.${language}`)}
    </MobileMenuItem>
  )

  render() {
    const { children, targetLanguageList } = this.props;

    if (targetLanguageList.length === 1) {
      return (
        <Link href={this.getGoogleTranslateURL(targetLanguageList[0])}>
          {children}
        </Link>
      );
    }

    return (
      <Select
        filterable={false}
        items={targetLanguageList}
        itemRenderer={this.languageItemRenderer}
        mobileVersion={{
          drawerSize: '80%',
          itemRenderer: this.mobileLanguageItemRenderer,
        }}
        onItemSelect={this.handleLanguageItemSelect}
      >
        <Link href={this.getGoogleTranslateURL(targetLanguageList[0])} onClick={this.handleLinkClick}>
          {children}
        </Link>
      </Select>
    );
  }
}
