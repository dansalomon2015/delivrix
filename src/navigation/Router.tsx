import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { useAppSelector } from "@storage";
import { Welcome } from "@screens";
import { MainStack } from "./MainStack";

export default () => {
    const firstLaunch = useAppSelector((state) => state.rootReducer.firstLaunch);

    return <NavigationContainer>{firstLaunch ? <Welcome /> : <MainStack />}</NavigationContainer>;
};
