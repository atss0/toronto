import 'react-native-gesture-handler';
import React from 'react';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import i18n from './src/i18n/i18n';
import store from './src/redux/store';
import App from './App';
import { ThemeProvider, useColors } from './src/context/ThemeContext';
import ErrorBoundary from './src/components/ErrorBoundary/ErrorBoundary';

const ThemedRoot: React.FC = () => {
  const colors = useColors();
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top', 'bottom']}>
        <App />
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default function ReduxProvider() {
  return (
    <I18nextProvider i18n={i18n}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Provider store={store}>
          <ThemeProvider>
            <ErrorBoundary>
              <ThemedRoot />
            </ErrorBoundary>
          </ThemeProvider>
        </Provider>
      </GestureHandlerRootView>
    </I18nextProvider>
  );
}
