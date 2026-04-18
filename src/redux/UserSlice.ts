import { createSlice } from '@reduxjs/toolkit'
import storage from '../storage';

interface User {
    id: number;
    name: string;
    surname: string;
    username: string;
    email: string;
    photo: string;
}

export type UserState = {
    user: User | null;
    token: any;
    location: { latitude: number | null, longitude: number | null };
    locationName?: string;
}

const initialState: UserState = {
    user: null,
    token: null,
    location: { latitude: null, longitude: null }, // Konum bilgisi
    locationName: '', // Konum adı
}

const UserSlice = createSlice({
    name: 'user',
    initialState: initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
        },
        clearUser: state => {
            state.user = null;
            state.token = null;
            storage.remove('user');
            storage.remove('token');
        },
        setLocationName: (state, action: { payload: string }) => {
            state.locationName = action.payload;
        },
    },
})

export const { setUser, clearUser, setLocationName } = UserSlice.actions;
export default UserSlice.reducer