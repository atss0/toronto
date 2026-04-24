import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavigationContainer, LinkingOptions } from '@react-navigation/native';
import RootStackNavigator from './src/navigators/RootStackNavigator';
import AuthStackNavigator from './src/navigators/AuthStackNavigator';
import SplashScreen from './src/screens/SplashScreen';
import { RootState } from './src/redux/store';
import { setUser } from './src/redux/UserSlice';
import userService from './src/services/user';
import { setTheme } from './src/redux/ThemeSlice';
import { setLanguage } from './src/redux/LanguageSlice';
import storage from './src/storage';
import { tokenStorage } from './src/storage/tokenStorage';
import { configureGoogleSignin } from './src/config/google';
import { RootStackParamList } from './src/types/navigation';

configureGoogleSignin();

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
    const init = async () => {
      const { accessToken, refreshToken } = await tokenStorage.init();

      if (accessToken && storage.contains('user')) {
        const raw = storage.getString('user');
        if (raw) {
          dispatch(setUser({ user: JSON.parse(raw), token: accessToken, refreshToken }));
        }
        // Refresh full profile (with preferences & stats) in background
        userService.getMe().then(res => {
          dispatch(setUser({ user: res.data.data }));
        }).catch(() => {});
      }

      if (storage.contains('lang')) {
        dispatch(setLanguage(storage.getString('lang') as 'en' | 'tr'));
      }
      if (storage.contains('theme')) {
        dispatch(setTheme(storage.getString('theme') as 'light' | 'dark'));
      }

      const hasSeenOnboarding = storage.contains('onboardingComplete');
      setShowOnboarding(!hasSeenOnboarding);
      setIsLoading(false);
    };

    init();
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
