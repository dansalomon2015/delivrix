import { configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "@react-native-async-storage/async-storage";
import { TypedUseSelectorHook, useSelector } from "react-redux";
import appSlice from "./reducers";

const persistConfig = {
    key: "root",
    storage: storage,
};

const _persistedReducer = persistReducer(persistConfig, appSlice.reducer);

const store = configureStore({
    reducer: {
        rootReducer: _persistedReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            immutableCheck: false,
            serializableCheck: false,
        }),
});

let persistor = persistStore(store);

type AppStateType = ReturnType<typeof store.getState>;
const useAppSelector: TypedUseSelectorHook<AppStateType> = useSelector;

const { storeUser, updateLaunchStatus, logout, setCurrentShop, setJumpToProfile } = appSlice.actions;

export { store, persistor, useAppSelector, storeUser, updateLaunchStatus, logout, setCurrentShop, setJumpToProfile };
