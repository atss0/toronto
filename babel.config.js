module.exports = function (api) {
  api.cache(true);

  const iconData = require('./iconify.generated.json'); // { icons: [...] }

  return {
    presets: ['module:@react-native/babel-preset'],
    plugins: [
      [
        'react-native-iconify/babel',
        {
          icons: iconData.icons, // artÄ±k otomatik liste buradan geliyor
        },
      ],
      'react-native-worklets/plugin',
    ],
  };
};