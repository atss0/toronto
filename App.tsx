import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import TabNavigator from './src/navigators/TabNavigator';
import AuthStackNavigatior from './src/navigators/AuthStackNavigator';
import { useSelector } from 'react-redux';
import { RootState } from './src/redux/store';
import { setUser } from './src/redux/UserSlice';
import storage from './src/storage';

const App = () => {
  const screenState = useSelector((state: RootState) => state.User);
  const dispatch = useDispatch();


  useEffect(() => {
    if (storage.contains('user') && storage.contains('token')) {
      const user: any = storage.getString('user');
      dispatch(
        setUser({ user: JSON.parse(user), token: storage.getString('token') }),
      );
    }

    if (storage.contains('lang')) {
      const lang = storage.getString('lang') as 'en' | 'tr';
      dispatch({ type: 'language/setLanguage', payload: lang });
    }
  }, []);
  return (
    <NavigationContainer>
      {!screenState.token ? (
        <TabNavigator />
      ) : (
        <AuthStackNavigatior />
      )}
    </NavigationContainer>
  );
};

export default App;