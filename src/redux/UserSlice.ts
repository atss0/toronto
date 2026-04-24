import { createSlice } from '@reduxjs/toolkit';
import storage from '../storage';

export interface User {
  id: string;
  name: string;
  surname: string;
  username: string;
  email: string;
  photo: string;
  is_email_verified: boolean;
  is_premium: boolean;
  travel_style?: string;
  budget_level?: string;
  interests?: string[];
  preferred_currency?: string;
  language?: string;
  stats?: {
    total_routes: number;
    places_visited: number;
    cities_explored: number;
  };
}

export type UserState = {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  location: { latitude: number | null; longitude: number | null };
  locationName?: string;
};

const initialState: UserState = {
  user: null,
  token: null,
  refreshToken: null,
  location: { latitude: null, longitude: null },
  locationName: '',
};

const UserSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload.user;
      if (action.payload.token !== undefined) state.token = action.payload.token;
      if (action.payload.refreshToken !== undefined) state.refreshToken = action.payload.refreshToken;
      storage.set('user', JSON.stringify(action.payload.user));
    },
    setPreferences: (state, action) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        storage.set('user', JSON.stringify(state.user));
      }
    },
    clearUser: state => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      storage.remove('user');
    },
    setLocationName: (state, action: { payload: string }) => {
      state.locationName = action.payload;
    },
  },
});

export const { setUser, setPreferences, clearUser, setLocationName } = UserSlice.actions;
export default UserSlice.reducer;
