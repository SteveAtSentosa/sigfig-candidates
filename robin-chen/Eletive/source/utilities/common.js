import _ from 'lodash';
import MobileDetect from 'mobile-detect';
import { detect as detectBrowser } from 'detect-browser';

export const delay = (timeout = 0) => (
  new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, timeout);
  })
);

export const isMobileVersion = Boolean(
  new MobileDetect(window.navigator.userAgent).mobile(),
);

const browser = detectBrowser();
export const isBrowserIE = browser && browser.name === 'ie';

/**
 * Tweaks history's object default "push" method -
 * if target URL is the same as the current URL it
 * uses "replace" method instead of "push"
 *
 * NOTE: refer #EL-194 task for additional details
 * @param {BrowserHistory} history
 */
export const tweakBrowserHistory = (history) => {
  const tweakedHistory = history;

  tweakedHistory.originalPush = history.push;

  tweakedHistory.push = (...args) => {
    const [path] = args;

    if (history.location.pathname === path) {
      history.replace(...args);
      return;
    }

    history.originalPush(...args);
  };

  return tweakedHistory;
};

export const ScreenSizes = {
  xs: 576,
  sm: 768,
  md: 992,
  1024: 1024,
  lg: 1200,
  xl: Infinity,
};

export const getScreenSize = size => _.values(ScreenSizes)
  .sort((a, b) => (a > b ? 1 : -1))
  .find(breakpoint => size <= breakpoint);

export const getRoundedNumber = (number, numberOf) => parseFloat(number.toFixed(numberOf));

export const getHashCode = (str) => {
  let h = 0;
  for (let i = 0; i < str.length; i += 1) {
    // eslint-disable-next-line no-bitwise
    h = (h << 5) - h + str.charCodeAt(i) | 0;
  }

  return h;
};
