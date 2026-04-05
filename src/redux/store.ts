import { combineReducers, configureStore } from "@reduxjs/toolkit";
import UserSlice from "./UserSlice";
import LanguageSlice from "./LanguageSlice";

const rootReducer = combineReducers({
    User: UserSlice,
    Language: LanguageSlice
})

export type RootState = ReturnType<typeof rootReducer>

const store = configureStore({
    reducer: rootReducer
})

export default store