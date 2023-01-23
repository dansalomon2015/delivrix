import { useNavigation } from "@react-navigation/native";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setJumpToProfile } from "src/storage";
import { fcmService } from "./";
import { localNotificationService } from "./localNotificationService";

export const NotificationReceiver = () => {
    const dispatch = useDispatch();
    const navigaton = useNavigation();
    useEffect(() => {
        fcmService.registerAppWithFCM();
        fcmService.register(onRegister, onNotification, onOpenNotification);
        localNotificationService.createChannel();
        localNotificationService.configure(onOpenNotification);

        function onRegister(token?: string) {
            console.log("[App] onRegister: ", token);
        }

        function onNotification(notify: any) {
            console.log("[App] onNotification: ", notify);
        }

        function onOpenNotification(notify: any) {
            console.log("[App] onOpenNotification: ", notify);
            // dispatch(setJumpToProfile(true));
            // @ts-ignore
            navigaton.navigate("Profile");
        }
    }, []);

    return <></>;
};
