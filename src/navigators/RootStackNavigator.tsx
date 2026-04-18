import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import TabNavigator from './TabNavigator';

import PlaceDetailScreen from '../screens/PlaceDetailScreen';
import RouteDetailScreen from '../screens/RouteDetailScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import NotificationSettingsScreen from '../screens/NotificationSettingsScreen';
import LocationSettingsScreen from '../screens/LocationSettingsScreen';
import InterestsScreen from '../screens/InterestsScreen';
import BudgetSettingsScreen from '../screens/BudgetSettingsScreen';
import TravelStyleScreen from '../screens/TravelStyleScreen';
import CurrencySettingsScreen from '../screens/CurrencySettingsScreen';
import HelpCenterScreen from '../screens/HelpCenterScreen';
import PrivacyPolicyScreen from '../screens/PrivacyPolicyScreen';
import TermsOfServiceScreen from '../screens/TermsOfServiceScreen';
import CreateRouteScreen from '../screens/CreateRouteScreen';
import SeeAllScreen from '../screens/SeeAllScreen';
import PremiumUpgradeScreen from '../screens/PremiumUpgradeScreen';
import ChatSettingsScreen from '../screens/ChatSettingsScreen';
import ChangePasswordScreen from '../screens/ChangePasswordScreen';
import SearchResultsScreen from '../screens/SearchResultsScreen';
import MapFullScreen from '../screens/MapFullScreen';
import NavigationScreen from '../screens/NavigationScreen';
import BookmarksSavedScreen from '../screens/BookmarksSavedScreen';
import ReviewsScreen from '../screens/ReviewsScreen';
import FilterScreen from '../screens/FilterScreen';
import OfflineRoutesScreen from '../screens/OfflineRoutesScreen';
import TripHistoryScreen from '../screens/TripHistoryScreen';
import ShareRouteScreen from '../screens/ShareRouteScreen';
import WeatherDetailScreen from '../screens/WeatherDetailScreen';
import CityPickerScreen from '../screens/CityPickerScreen';

const Stack = createNativeStackNavigator();

const RootStackNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Main"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Main" component={TabNavigator} />

      <Stack.Screen name="PlaceDetail" component={PlaceDetailScreen} />
      <Stack.Screen name="RouteDetail" component={RouteDetailScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
      <Stack.Screen name="NotificationSettings" component={NotificationSettingsScreen} />
      <Stack.Screen name="LocationSettings" component={LocationSettingsScreen} />
      <Stack.Screen name="Interests" component={InterestsScreen} />
      <Stack.Screen name="BudgetSettings" component={BudgetSettingsScreen} />
      <Stack.Screen name="TravelStyle" component={TravelStyleScreen} />
      <Stack.Screen name="CurrencySettings" component={CurrencySettingsScreen} />
      <Stack.Screen name="HelpCenter" component={HelpCenterScreen} />
      <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} />
      <Stack.Screen name="TermsOfService" component={TermsOfServiceScreen} />
      <Stack.Screen name="CreateRoute" component={CreateRouteScreen} />
      <Stack.Screen name="SeeAll" component={SeeAllScreen} />
      <Stack.Screen name="PremiumUpgrade" component={PremiumUpgradeScreen} />
      <Stack.Screen name="ChatSettings" component={ChatSettingsScreen} />

      <Stack.Screen name="SearchResults" component={SearchResultsScreen} />
      <Stack.Screen name="MapFull" component={MapFullScreen} />
      <Stack.Screen name="Navigation" component={NavigationScreen} />
      <Stack.Screen name="BookmarksSaved" component={BookmarksSavedScreen} />
      <Stack.Screen name="Reviews" component={ReviewsScreen} />
      <Stack.Screen name="Filter" component={FilterScreen} />

      <Stack.Screen name="OfflineRoutes" component={OfflineRoutesScreen} />
      <Stack.Screen name="TripHistory" component={TripHistoryScreen} />
      <Stack.Screen name="ShareRoute" component={ShareRouteScreen} />
      <Stack.Screen name="WeatherDetail" component={WeatherDetailScreen} />
      <Stack.Screen name="CityPicker" component={CityPickerScreen} />
    </Stack.Navigator>
  );
};

export default RootStackNavigator;
