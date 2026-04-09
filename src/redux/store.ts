import { combineReducers, configureStore } from "@reduxjs/toolkit";
import UserSlice from "./UserSlice";
import LanguageSlice from "./LanguageSlice";
import ThemeSlice from "./ThemeSlice";

const rootReducer = combineReducers({
    User: UserSlice,
    Language: LanguageSlice,
    Theme: ThemeSlice,
})

export type RootState = ReturnType<typeof rootReducer>

const store = configureStore({
    reducer: rootReducer
})

export default store
