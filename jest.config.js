module.exports = {
  preset: 'react-native',

  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],

  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/__mocks__/fileMock.js',
  },

  setupFiles: ['./jest.setup.js'],

  transformIgnorePatterns: [
    'node_modules/(?!(react-native' +
      '|@react-native' +
      '|@react-navigation' +
      '|react-native-reanimated' +
      '|react-native-gesture-handler' +
      '|react-native-safe-area-context' +
      '|react-native-screens' +
      '|react-native-iconify' +
      '|react-native-mmkv' +
      '|react-native-keychain' +
      '|react-native-localize' +
      '|react-native-image-picker' +
      '|react-native-element-dropdown' +
      '|react-native-svg' +
      '|@react-native-clipboard/clipboard' +
      '|@react-native-google-signin/google-signin' +
      '|@invertase/react-native-apple-authentication' +
      '|@gorhom/bottom-sheet' +
      '|@reduxjs/toolkit' +
      '|immer' +
      '|i18next' +
      '|react-i18next' +
      '|react-redux' +
    ')/)',
  ],

  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.style.ts',
    '!src/**/index.ts',
    '!src/types/**',
    '!src/assets/**',
    '!src/data/**',
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 75,
      lines: 80,
      statements: 80,
    },
  },
};
