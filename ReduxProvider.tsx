import 'react-native-gesture-handler';
import React from 'react';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import i18n from './src/i18n/i18n';
import store from './src/redux/store';
import App from './App';
import Colors from './src/styles/Colors';

export default function ReduxProvider() {
  return (
    <I18nextProvider i18n={i18n}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Provider store={store}>
          <SafeAreaProvider>
            <SafeAreaView style={{ flex: 1, backgroundColor: Colors.white }} edges={['top','bottom']}>
              <App />
            </SafeAreaView>
          </SafeAreaProvider>
        </Provider>
      </GestureHandlerRootView>
    </I18nextProvider>
  );
}