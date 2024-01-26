const { getDefaultConfig } = require('expo/metro-config');
module.exports = function (api) {
  const {
    resolver: { sourceExts, assetExts },
  } = getDefaultConfig(__dirname);
  api.cache(true);
  return {
    presets: ['babel-preset-expo', '@babel/preset-react'],
    plugins: [
      [
        'module-resolver',
        {
          alias: {
            '@': './src',
            'assets': './assets',
          }
        },
      ],
      'react-native-reanimated/plugin',
      '@babel/plugin-transform-runtime',
    ],

  };
};
