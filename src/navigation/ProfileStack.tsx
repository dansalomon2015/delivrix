import { TransitionPresets, createStackNavigator, StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import { Home, Profile, Settings, ShopsScreen } from "@screens";
import { MainStackParams } from "./MainStack";

export type ProfileStackParams = {
    Profile: undefined;
};

export type MainStackNavigationProps<T extends keyof ProfileStackParams> = {
    navigation: StackNavigationProp<ProfileStackParams, T>;
    route: RouteProp<ProfileStackParams, T>;
} & MainStackParams;

const Stack = createStackNavigator<ProfileStackParams>();

export const ProfileStack = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
                gestureEnabled: true,
                ...TransitionPresets.SlideFromRightIOS,
            }}
        >
            <Stack.Screen name="Profile" component={Profile} />
        </Stack.Navigator>
    );
};
