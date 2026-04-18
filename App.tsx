import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavigationContainer, LinkingOptions } from '@react-navigation/native';
import RootStackNavigator from './src/navigators/RootStackNavigator';
import AuthStackNavigator from './src/navigators/AuthStackNavigator';
import SplashScreen from './src/screens/SplashScreen';
import { RootState } from './src/redux/store';
import { setUser } from './src/redux/UserSlice';
import { setTheme } from './src/redux/ThemeSlice';
import { setLanguage } from './src/redux/LanguageSlice';
import storage from './src/storage';
import { RootStackParamList } from './src/types/navigation';

const linking: LinkingOptions<RootStackParamList> = {
  prefixes: ['toronto://', 'https://toronto-app.com'],
  config: {
    screens: {
      Main: {
        screens: {
          Home: 'home',
          Explore: 'explore',
          Routes: 'routes',
          Profile: 'profile',
        },
      },
      PlaceDetail: 'place/:placeId',
      RouteDetail: 'route/:routeId',
      SearchResults: 'search',
      MapFull: 'map',
    },
  },
};

const App = () => {
  const screenState = useSelector((state: RootState) => state.User);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);

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
    const hasSeenOnboarding = storage.contains('onboardingComplete');
    setShowOnboarding(!hasSeenOnboarding);
    setIsLoading(false);
  }, [dispatch]);

  if (isLoading) return <SplashScreen />;

  return (
    <NavigationContainer linking={linking}>
      {screenState.token ? (
        <RootStackNavigator />
      ) : (
        <AuthStackNavigator initialRoute={showOnboarding ? 'Onboarding' : 'Login'} />
      )}
    </NavigationContainer>
  );
};

export default App;
