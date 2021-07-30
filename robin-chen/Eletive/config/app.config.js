const merge = require('webpack-merge');

const base = { //  production
  apiBaseUrl: '"https://api.eletive.com/v1"',
  staticUrl: '"https://static.eletive.com/prod"',
  stage: '"prod"',
};

const stage = {
  dev: {
    apiBaseUrl: '"https://api.eletive.com/dev"',
    staticUrl: '"https://static.eletive.com/dev"',
    stage: '"dev"',
  },
  localAPI: {
    apiBaseUrl: '"http://localhost:4000"',
    staticUrl: '"https://static.eletive.com/dev"',
    stage: '"local"',
  },
};


module.exports = merge(base, process.env.STAGE ? stage[process.env.STAGE] : {});
