import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootStateType, ShopType, UserType } from "@utils";

const initialState: RootStateType = {
    firstLaunch: true,
    user: undefined,
    currentShop: undefined,
    jumpToProfile: true,
};

const appSlice = createSlice({
    name: "rootReducer",
    initialState,
    reducers: {
        updateLaunchStatus: (state, action: PayloadAction<boolean>) => {
            state.firstLaunch = action.payload;
        },
        storeUser: (state, action: PayloadAction<UserType>) => {
            state.user = action.payload;
        },
        logout: (state) => {
            state.firstLaunch = true;
            state.user = undefined;
            state.currentShop = undefined;
        },
        setCurrentShop: (state, action: PayloadAction<ShopType>) => {
            state.currentShop = action.payload;
        },
        setJumpToProfile: (state, action: PayloadAction<boolean>) => {
            state.jumpToProfile = action.payload;
        },
    },
});

export default appSlice;
