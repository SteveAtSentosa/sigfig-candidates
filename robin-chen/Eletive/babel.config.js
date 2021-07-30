const presets = [
  '@babel/preset-react',
  [
    '@babel/env',
    {
      useBuiltIns: 'usage',
      corejs: '^3.6.4',
    },
  ],
];

module.exports = { presets };
