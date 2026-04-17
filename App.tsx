import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import TabNavigator from './src/navigators/TabNavigator';
import AuthStackNavigator from './src/navigators/AuthStackNavigator';
import { RootState } from './src/redux/store';
import { setUser } from './src/redux/UserSlice';
import { setTheme } from './src/redux/ThemeSlice';
import { setLanguage } from './src/redux/LanguageSlice';
import storage from './src/storage';

const App = () => {
  const screenState = useSelector((state: RootState) => state.User);
  const dispatch = useDispatch();

  useEffect(() => {
    if (storage.contains('user') && storage.contains('token')) {
      const raw = storage.getString('user');
      if (raw) {
        dispatch(setUser({ user: JSON.parse(raw), token: storage.getString('token') }));
      }
    }
    if (storage.contains('lang')) {
      const lang = storage.getString('lang') as 'en' | 'tr';
      dispatch(setLanguage(lang));
    }
    if (storage.contains('theme')) {
      const theme = storage.getString('theme') as 'light' | 'dark';
      dispatch(setTheme(theme));
    }
  }, [dispatch]);

  return (
    <NavigationContainer>
      {!screenState.token ? (
        <TabNavigator />
      ) : (
        <AuthStackNavigator />
      )}
    </NavigationContainer>
  );
};

export default App;
