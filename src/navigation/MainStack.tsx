import React from "react";
import { TransitionPresets, createStackNavigator, StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import { Home, Profile, Settings, ShopsScreen } from "@screens";

export type MainStackParams = {
    Home: undefined;
    Settings: undefined;
    Profile: undefined;
    ShopsScreen: undefined;
};

export type MainStackNavigationProps<T extends keyof MainStackParams> = {
    navigation: StackNavigationProp<MainStackParams, T>;
    route: RouteProp<MainStackParams, T>;
};

const Stack = createStackNavigator<MainStackParams>();

export const MainStack = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
                gestureEnabled: true,
                ...TransitionPresets.SlideFromRightIOS,
            }}
        >
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="Settings" component={Settings} />
            <Stack.Screen name="Profile" component={Profile} />
            <Stack.Screen name="ShopsScreen" component={ShopsScreen} />
        </Stack.Navigator>
    );
};
