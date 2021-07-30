/* eslint
  no-console: 0,
  no-restricted-syntax: 0,
  no-await-in-loop: 0,
  no-continue: 0,
  no-use-before-define: 0,
*/

/** run with:
 * without params: interactive
 * --toPhraseApp: export to phraseApp
 * --fromPhraseApp: import from phraseApp
 * --removeInPhraseApp: remove not exists keys from phraseApp
 * */

const debug = false;
const _ = require('lodash');
const path = require('path');
const glob = require('glob');
const chalk = require('chalk');
const axios = require('axios');
const flatten = require('flat');
const jsonfile = require('jsonfile');
const inquirer = require('inquirer');

// Count of translation that you have for sure - it'll be loaded in parallel
const currentKeysCount = 15000;
const ProjectID = '3a2e14ea7daa4b3120ac0f354fb24b53';
const AccessToken = '388cdc9ce24e112b49178702cf77830d299efb9ee0124f37b6506af4d03c432d';
const PhraseAppRequestLimit = 1000;
const PhraseAppRequestLimitPeriod = 3e5; // 5 min
const PhraseAppRequestConcurrentLimit = 4;
const PhraseAppRequestMaxRetries = 20;

const Locales = {
  en: '7300c9834aadcfc864fa352dcadb33ed',
  sv: '8479c207390f6738f89c150fd8e0bc46',
  no: '4139a1f4ab5516a0d53252bf52380aa0',
  fi: '214957b6543653c43926dfff1a480309',
  da: '7d0f2fab0f3bd5987e3da2f24b243d31',
  ar: '3d451c12b749a48b8cd276e6bc1b9ab3',
  cs: 'fa6dd8cb942b7391c57fcf35d60c4e9e',
  de: 'd39ca6a3453a25f67e4d6b5882b1e24e',
  es: 'a1ad4cc2e42b724e52f5473a4cf48a2b',
  et: '217362989120445616e9e14dd40c436b',
  fr: '1acccd04d654a7e73538b285ff67b86d',
  he: 'bf466e9c0dec246f8afc1fc818ce18b4',
  hi: '84317f1bae9debb6fdf200359758390b',
  hu: '850174d2ad561e9736a77bddc513905e',
  it: '64eea96f3df19b385a94abc36597ba9d',
  ja: 'f7bd11d4f944a89292f737907f3a4b4b',
  lt: '58a4e86eb3d3ad5424bb4343dad8b14c',
  lv: '7e6e3558e42eb4f218f151c8416cad51',
  ms: '6ccf6d68a237dba1da40eefaf58aa64e',
  nl: 'c2c4f4bd9b606562419bcad883a1d0be',
  pl: '95723931d20d63a0c142332225febe61',
  pt: '7608cb174cb22bfdb582e8f8d4638abe',
  ro: '92560dff9d286c0203d683b84dde1438',
  ru: '46d37b1236ce86560c2c6aea86fe4e1d',
  sk: 'd1eb33f1fd82c3ceabc2a14cd5043fca',
  th: '23dcccdbedd61f7d57873c07a266902e',
  uk: 'f2ea8f77acdf952c2957a20e7275055d',
  vi: '581f7586e712710069d905a99ea02a7c',
  zhs: 'e7b5529c7b840843157320c4e54623bb',
  zht: 'd946f2d3bb2aa0799a7fb5757ffe7613',
};

const http = axios.create({
  baseURL: `https://api.phraseapp.com/api/v2/projects/${ProjectID}`,
  headers: {
    Authorization: `token ${AccessToken}`,
  },
});

const skippedLocaleKeys = [];
let phraseAppKeys;

const getAction = async () => (
  inquirer.prompt([{
    type: 'list',
    name: 'action',
    message: 'Select action',
    // eslint-disable-next-line compat/compat
    choices: Object.values(actions),
    default: actions.toPhraseApp,
  }])
);

let PhraseAppRequestCount = 0;
let PhraseAppRequestCountStart = 0;
let PhraseAppRequestConcurrentCount = 0;
const phraseAppRequest = (url, data, method, repeat = 0) => {
  const delay = () => new Promise((resolve) => {
    setTimeout(() => {
      resolve(phraseAppRequest(url, data, method, repeat + 1));
    }, 100 + Math.random() * (2 ** repeat));
  });

  if (repeat > PhraseAppRequestMaxRetries) {
    console.log(url, data);
    throw Error('Max retries');
  }

  if (PhraseAppRequestConcurrentCount >= PhraseAppRequestConcurrentLimit ||
    (PhraseAppRequestCount > PhraseAppRequestLimit &&
      Date.now() - PhraseAppRequestCountStart < PhraseAppRequestLimitPeriod)) {
    return delay();
  }
  if (!PhraseAppRequestCountStart ||
    Date.now() - PhraseAppRequestCountStart >= PhraseAppRequestLimitPeriod) {
    PhraseAppRequestCountStart = Date.now();
    PhraseAppRequestConcurrentCount = 0;
  }

  PhraseAppRequestConcurrentCount += 1;
  PhraseAppRequestCount += 1;
  let request;
  if (!method) {
    request = data ? http.post(url, data) : http.get(url);
  } else if (method === 'patch') {
    http.patch(url, data);
  }
  return request.then(({ data: response, headers }) => {
    if (headers['x-rate-limit-remaining'] &&
      headers['x-rate-limit-remaining'] < PhraseAppRequestLimit - PhraseAppRequestCount) {
      PhraseAppRequestCount = PhraseAppRequestLimit - headers['x-rate-limit-remaining'];
    }
    if (headers['x-rate-limit-reset'] &&
      headers['x-rate-limit-reset'] > (PhraseAppRequestCountStart + PhraseAppRequestLimitPeriod) / 1000) {
      PhraseAppRequestCountStart = headers['x-rate-limit-reset'] * 1000 - PhraseAppRequestLimitPeriod;
    }
    PhraseAppRequestConcurrentCount -= 1;
    return response;
  }).catch((error) => {
    if (error.response && error.response.status === 429) {
      return delay();
    }
    console.log(url, data, error.Error);
    throw error;
  });
};

const prepareKey = key => key.replace(/ /g, '-').replace(/,/g, '');

const createLocaleKey = (name, tags) => phraseAppRequest('/keys', { name, tags });

const createLocaleTranslation =
  (key, localeName, translation) => phraseAppRequest('/translations', {
    key_id: key.id,
    locale_id: Locales[localeName],
    content: translation,
    unverified: true,
  });

const getFilesInDirectory = (directoryPath, pattern) => (
  glob.sync(`${directoryPath}/${pattern}`)
);

const findLocaleInLocaleList = (localeList, localeName) => (
  localeList.find(locale => locale.localeName === localeName)
);

const getComponentLocaleKeyList = (componentLocale, prefixWithComponentLocaleName = false) => {
  const enLocale = findLocaleInLocaleList(componentLocale.localeList, 'en');
  const enLocaleContent = enLocale.localeContent;
  const enLocaleTranslations = enLocaleContent.translations;
  const enLocaleTranslationsFlatten = flatten(enLocaleTranslations);

  const localeKeyList = _.keys(enLocaleTranslationsFlatten);

  if (prefixWithComponentLocaleName) {
    return localeKeyList.map(key => `${componentLocale.localeComponentName}.${key}`);
  }

  return localeKeyList;
};

const getSingleComponentLocaleList = (directoryPath) => {
  const localeFiles = getFilesInDirectory(directoryPath, '*.json');

  return localeFiles.map((filePath) => {
    const fileName = path.basename(filePath);
    const localeName = path.basename(filePath, '.json');
    const localeContent = jsonfile.readFileSync(filePath);

    const localeComponentName = localeContent.name;

    return {
      filePath,
      fileName,
      localeName,
      localeContent,
      localeComponentName,
    };
  });
};

const getComponentLocaleList = () => {
  const directories = glob.sync(`${__dirname}/../source/**/*.Locales`);

  return directories.map((directoryPath) => {
    const directoryName = directoryPath.split('/').pop();

    const localeList = getSingleComponentLocaleList(directoryPath);
    const localeNameList = localeList.map(locale => locale.localeName);
    const { localeComponentName } = _.first(localeList);

    return {
      directoryPath,
      directoryName,
      parentDirectoryName: path.dirname(directoryPath),
      localeList,
      localeNameList,
      localeComponentName,
    };
  });
};

// eslint-disable-next-line max-len
const getTranslationsListPage = (page = 1, previous = []) => phraseAppRequest(`/translations?per_page=100&page=${page}&q=tags:FE`)
  .then((data) => {
    debug && console.log(`Translations loaded page ${chalk.green(page)}`);
    if (previous.length) {
      previous.push(...data);
      console.log(`Translations loaded ${chalk.green(previous.length)}`);
      return data.length === 100 ? getTranslationsListPage(page + 1, previous) : previous;
    }
    return data;
  });

// eslint-disable-next-line max-len
const listTranslations = () => Promise.all([...Array(currentKeysCount / 100)].map((e, i) => getTranslationsListPage(i + 1)))
  .then((data) => {
    const previous = data.flat();
    return getTranslationsListPage(currentKeysCount / 100 + 1, previous);
  });

const exportComponentLocaleKeys = async (componentLocale) => {
  const { localeComponentName } = componentLocale;
  debug && console.log(`Start processing locale keys from component ${chalk.green(localeComponentName)}`);

  const componentLocaleKeyTags = ['FE', localeComponentName];
  const componentLocaleKeyList = getComponentLocaleKeyList(componentLocale, false);

  for (const localeKeyName of componentLocaleKeyList) {
    const localeFullKeyName = prepareKey(`${localeComponentName}.${localeKeyName}`);

    debug && console.log(`Start processing new key. Key name: ${chalk.green(localeKeyName)}`);
    const isLocaleKeyExists = phraseAppKeys.some(e => e.key.name === localeFullKeyName);

    if (isLocaleKeyExists) {
      debug && console.log('Key already exists. Skipping...');
      continue;
    }

    createLocaleKey(localeFullKeyName, componentLocaleKeyTags.join(','))
      .then((createdLocaleKey) => {
        console.log(`Key ${chalk.red(localeFullKeyName)} created`);

        const { localeList, localeNameList } = componentLocale;
        for (const localeName of localeNameList) {
          const { localeContent: { translations } } = findLocaleInLocaleList(localeList, localeName);

          const translationContent = _.get(translations, localeKeyName);
          if (localeName === 'en' || translationContent) {
            createLocaleTranslation(createdLocaleKey, localeName, translationContent)
              .then(() => {
                console.log(`Key ${chalk.red(localeFullKeyName)} translation ${chalk.red(localeName)} created`);
              });
          }
        }
      })
      .catch(() => {
        console.log('Error on creating key');
      });
  }
};

const setKey = (object, key, value) => {
  const keyPath = key.split('.');
  let obj = object;
  while (keyPath.length - 1) {
    const p = keyPath.shift();
    if (!(p in obj)) {
      obj[p] = {};
    }
    obj = obj[p];
  }
  obj[keyPath[0]] = value;
};

const updateComponentCurrentLocaleTranslation = (localeToUpdate, localeKeyName, localeKeyTranslation) => {
  const { localeContent } = localeToUpdate;

  const currentTranslation = _.get(localeContent.translations, localeKeyName);
  if (currentTranslation === localeKeyTranslation.content) {
    debug && console.log('Current translation value is the same as from PhraseApp. Skipping...');
    return;
  }

  if (!localeKeyTranslation.content) {
    debug && console.log('Current translation value is naught. Skipping...');
    return;
  }
  setKey(localeContent.translations, localeKeyName, localeKeyTranslation.content);

  jsonfile.writeFileSync(localeToUpdate.filePath, localeContent, { spaces: 2 });
  console.log(`Local translation file ${chalk.green(localeToUpdate.fileName)} updated`);
};

const createComponentCurrentLocaleTranslation = (componentLocale, localeName, localeKeyName, localeKeyTranslation) => {
  const translations = {};
  setKey(translations, localeKeyName, localeKeyTranslation.content);
  const localeToCreate = {
    fileName: `${localeName}.json`,
    filePath: `${componentLocale.directoryPath}/${localeName}.json`,
    localeName,
    localeContent: {
      name: componentLocale.localeComponentName,
      translations,
    },
  };

  componentLocale.localeNameList.push(localeName);
  componentLocale.localeList.push(localeToCreate);

  jsonfile.writeFileSync(localeToCreate.filePath, localeToCreate.localeContent, { spaces: 2 });
  console.log(`Locale translation file ${chalk.green(localeToCreate.fileName)} created`);
};

const importComponentTranslations = async (componentLocale, onlyCheckKey = false) => {
  const { localeComponentName } = componentLocale;
  debug && console.log(`Start processing locale keys from component ${chalk.green(localeComponentName)}`);

  const componentLocaleKeyList = getComponentLocaleKeyList(componentLocale, false);

  for (const localeKeyName of componentLocaleKeyList) {
    const localeFullKeyName = prepareKey(`${localeComponentName}.${localeKeyName}`);

    debug && console.log(`Start processing key. Key name: ${chalk.green(localeKeyName)}`);
    const localeKeyTranslations = phraseAppKeys.filter(e => e.key.name === localeFullKeyName);

    if (!localeKeyTranslations.length) {
      console.log(chalk.red(`Can't find locale key by it's name ${chalk.green(localeKeyName)}, skipping... `));
      skippedLocaleKeys.push(localeFullKeyName);
    }
    if (onlyCheckKey) {
      continue;
    }

    for (const localeKeyTranslation of localeKeyTranslations) {
      const localeName = localeKeyTranslation.locale.name.split('-')[0];

      if (!localeName) {
        debug && console.log(`Locale ${chalk.red(localeName)} is marked to be skipped. Go to next translation...`);
        continue;
      }

      if (localeKeyTranslation.unverified) {
        // eslint-disable-next-line max-len
        console.log(chalk.yellow(`${localeName} translation for ${chalk.red(localeFullKeyName)} key is unverified. Skipping...`));
        continue;
      }

      const { localeList } = componentLocale;
      const currentLocaleToUpdate = localeList.find(locale => locale.localeName === localeName);
      if (currentLocaleToUpdate) {
        debug && console.log(`Translation for language ${chalk.green(localeName)} exists`);
        updateComponentCurrentLocaleTranslation(currentLocaleToUpdate, localeKeyName, localeKeyTranslation);
      } else {
        console.log(`Translation for language ${localeName} doesn't exist`);
        createComponentCurrentLocaleTranslation(componentLocale, localeName, localeKeyName, localeKeyTranslation);
      }
    }
  }
};

const tagInPhraseAppKeysNotExistInApp = async (componentLocaleList) => {
  const localeKeys = [];
  for (const componentLocale of componentLocaleList) {
    const componentLocaleKeyList = getComponentLocaleKeyList(componentLocale, false);
    localeKeys.push(...componentLocaleKeyList.map(k => prepareKey(`${componentLocale.localeComponentName}.${k}`)));
  }

  // eslint-disable-next-line compat/compat
  const notExistKeys = [...new Set(phraseAppKeys
    .filter(e => !localeKeys.includes(e.key.name))
    .map(e => e.key.name))];
  console.log(notExistKeys, notExistKeys.length);
};

const actions = {
  toPhraseApp: 'Export localization keys and translations to PhraseApp',
  fromPhraseApp: 'Import translations from PhraseApp',
  keysInPhraseAppNotExist: 'Keys in PhraseApp not exists in app',
};

const start = async () => {
  const selectedActions = Object.keys(actions)
    .filter(e => process.argv.some(arg => arg.toLowerCase() === `--${e.toLowerCase()}`));

  if (!selectedActions.length) {
    const { action } = await getAction();
    selectedActions.push(Object.keys(actions).find(e => actions[e] === action));
  }

  phraseAppKeys = await listTranslations();

  const componentLocaleList = getComponentLocaleList();

  const toPhraseApp = selectedActions.includes('toPhraseApp');
  const fromPhraseApp = selectedActions.includes('fromPhraseApp');
  const removeInPhraseApp = selectedActions.includes('keysInPhraseAppNotExist');
  for (const componentLocale of componentLocaleList) {
    toPhraseApp && await exportComponentLocaleKeys(componentLocale);
    fromPhraseApp && await importComponentTranslations(componentLocale);
  }
  removeInPhraseApp && await tagInPhraseAppKeysNotExistInApp(componentLocaleList);

  if (skippedLocaleKeys.length) {
    console.log('Skipped locale keys:');
    console.log(skippedLocaleKeys);
  }
  console.log(chalk.green('Done'));
};

start();
