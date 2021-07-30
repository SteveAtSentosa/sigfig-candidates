const config = require('./config/app.config');

module.exports = {
  roots: [
    '<rootDir>',
    '<rootDir>/source',
  ],
  globals: {
    CONFIG: config,
  },
  // Automatically clear mock calls and instances between every test
  clearMocks: true,

  // An array of glob patterns indicating a set of files for which coverage information should be collected
  collectCoverageFrom: ['source/**/*.{js,jsx,mjs}'],

  // The directory where Jest should output its coverage files
  coverageDirectory: 'test-reports',

  // An array of file extensions your modules use
  moduleFileExtensions: ['js', 'json', 'jsx'],

  // The paths to modules that run some code to configure or set up the testing environment before each test
  setupFiles: ['<rootDir>/enzyme.config.js'],

  // The test environment that will be used for testing
  testEnvironment: 'jsdom',

  // The glob patterns Jest uses to detect test files
  testMatch: ['**/__tests__/**/*.js?(x)', '**/?(*.)+(spec|test).js?(x)'],

  // An array of regexp pattern strings that are matched against all test paths, matched tests are skipped
  testPathIgnorePatterns: ['\\\\node_modules\\\\'],

  // This option sets the URL for the jsdom environment. It is reflected in properties such as location.href
  testURL: 'http://localhost',

  // An array of regexp pattern strings that are matched against all source file paths,
  // matched files will skip transformation
  transformIgnorePatterns: ['<rootDir>/node_modules/'],

  // Indicates whether each individual test should be reported during the run
  verbose: false,

  moduleNameMapper: {
    '\\.(css|less|scss)$': 'identity-obj-proxy',
    '\\.(svg|png)$': '<rootDir>/source/mocks/image-mock.js',
    '^api(.*)$': '<rootDir>/source/api$1',
    '^utils(.*)$': '<rootDir>/source/utils$1',
    '^Pages(.*)$': '<rootDir>/source/pages$1',
    '^Models(.*)$': '<rootDir>/source/models$1',
    '^Layouts(.*)$': '<rootDir>/source/layouts$1',
    '^Constants(.*)$': '<rootDir>/source/constants$1',
    '^Components(.*)$': '<rootDir>/source/components$1',
    '^Containers(.*)$': '<rootDir>/source/containers$1',
    '^store(.*)$': '<rootDir>/source/store$1',
    '^styles(.*)$': '<rootDir>/source/styles$1',
    '^images(.*)$': '<rootDir>/source/images$1',
    '^services(.*)$': '<rootDir>/source/services$1',
    '^utilities(.*)$': '<rootDir>/source/utilities$1',
  },
};
