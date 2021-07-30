import _ from 'lodash';

export const populateTranslations = (translations, translationContext) => {
  translationContext.keys().forEach((filePath) => {
    const translation = translationContext(filePath);
    const { name, translations: translationsContent } = translation;

    _.assign(translations, {
      [name]: translationsContent,
    });
  });

  return translations;
};
