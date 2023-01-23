import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { useAppSelector } from "@storage";
import { Profile, Welcome } from "@screens";
import { MainStack } from "./MainStack";
import { ProfileStack } from "./ProfileStack";

export default () => {
    const firstLaunch = useAppSelector((state) => state.rootReducer.firstLaunch);
    const shouldJumpToProfile = useAppSelector((state) => state.rootReducer.jumpToProfile);

    console.log("Jump", shouldJumpToProfile);

    if (shouldJumpToProfile) return <ProfileStack />;

    return firstLaunch ? <Welcome /> : <MainStack />;
};
