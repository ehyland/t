/** @type {import('@babel/core').ConfigFunction} */
module.exports = (api) => ({
  presets: [
    [
      '@babel/preset-env',
      {
        useBuiltIns: 'entry',
        corejs: 3,
        exclude: ['transform-typeof-symbol'],
      },
    ],
    [
      '@babel/preset-react',
      {
        runtime: 'automatic',
        development: api.env('development'),
      },
    ],
    ['@babel/preset-typescript'],
  ],
  plugins: ['@babel/plugin-transform-runtime'],
});
