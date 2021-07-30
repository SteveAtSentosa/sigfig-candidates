import _ from 'lodash';
import React from 'react';
import { I18n } from 'react-i18nify';

function pluralizeString(translatedString, replacements) {
  let pluralizedTranslatedString = translatedString;

  const pluralFormMatches = translatedString.match(/\$\{([^}]+)\}/gm);

  if (_.isNil(pluralFormMatches)) {
    return translatedString;
  }

  pluralFormMatches.forEach((match) => {
    const matchValue = match.substring(2, match.length - 1);
    const [valueName, single, plural] = matchValue.split(':');

    const value = replacements[valueName].toString();
    const isValueInPluralForm = _.endsWith(value, '1');

    pluralizedTranslatedString = pluralizedTranslatedString.replace(match, isValueInPluralForm ? single : plural);
  });

  return pluralizedTranslatedString;
}

export const withTranslation = prefix => Component => (
  React.forwardRef((props, ref) => {
    const i18n = (path, replacements) => {
      const translatedString = I18n.t(`${prefix}.${path}`, replacements);
      return pluralizeString(translatedString, replacements);
    };

    i18n.global = (path, replacements) => {
      const translatedString = I18n.t(`${path}`, replacements);
      return pluralizeString(translatedString, replacements);
    };

    const targetProps = {
      ...props,
      i18n,
    };

    return <Component ref={ref} {...targetProps} />;
  })
);

export const i18n = {
  global: (path, replacements) => {
    const translatedString = I18n.t(`${path}`, replacements);
    return pluralizeString(translatedString, replacements);
  },
  // eslint-disable-next-line no-underscore-dangle
  getCurrentLocaleName: () => I18n._locale,
};
