export const mockNavigation = {
  navigate: jest.fn(),
  goBack: jest.fn(),
  replace: jest.fn(),
  reset: jest.fn(),
  setOptions: jest.fn(),
  addListener: jest.fn(() => jest.fn()),
  removeListener: jest.fn(),
  dispatch: jest.fn(),
  canGoBack: jest.fn(() => true),
  getParent: jest.fn(),
  getState: jest.fn(),
  isFocused: jest.fn(() => true),
  getId: jest.fn(),
};

export const mockRoute = (params: Record<string, any> = {}) => ({
  key: 'test-route-key',
  name: 'TestScreen',
  params,
});

export const setupNavigationMock = () => {
  jest.mock('@react-navigation/native', () => {
    const actual = jest.requireActual('@react-navigation/native');
    return {
      ...actual,
      useNavigation: () => mockNavigation,
      useRoute: () => mockRoute(),
      useFocusEffect: jest.fn(),
      useIsFocused: () => true,
    };
  });
};
