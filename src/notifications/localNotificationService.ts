import PushNotification from "react-native-push-notification";
import PushNotificationIOS from "@react-native-community/push-notification-ios";
import { Platform } from "react-native";

class LocalNotificationService {
    configure = (onOpenNotification: (arg0: any) => void) => {
        PushNotification.configure({
            onRegister: function (token: any) {
                console.log("[LocalNotificationService] onRegister:", token);
            },
            // @ts-ignore
            onNotification: function (notification: {
                userInteraction: boolean;
                data: { item: any };
                finish: (arg0: string) => void;
            }) {
                console.log("[LocalNotificationService] onNotification:", notification);
                // if (!notification?.data) {
                //     return
                // }
                notification.userInteraction = true;
                // onOpenNotification(Platform.OS === "ios" ? notification.data.item : notification.data);

                if (Platform.OS === "ios") {
                    // (required) Called when a remote is received or opened, or local notification is opened
                    notification.finish(PushNotificationIOS.FetchResult.NoData);
                }
            },

            // IOS ONLY (optional): default: all - Permissions to register.
            permissions: {
                alert: true,
                badge: true,
                sound: true,
            },

            // Should the initial notification be popped automatically
            // default: true
            popInitialNotification: true,

            /**
             * (optional) default: true
             * - Specified if permissions (ios) and token (android and ios) will requested or not,
             * - if not, you must call PushNotificationsHandler.requestPermissions() later
             * - if you are not using remote notification or do not have Firebase installed, use this:
             *     requestPermissions: Platform.OS === 'ios'
             */
            requestPermissions: true,
        });
    };

    unregister = () => {
        PushNotification.unregister();
    };

    showNotification = (id: any, title: string, message: any, data = {}, options = {}) => {
        if (!(title == "driver_accepted_data" || title == "You are disconnected")) {
            PushNotification.localNotification({
                /* Android Only Properties */
                ...this.buildAndroidNotification(id, title, message, data, options),
                /* iOS and Android properties */
                ...this.buildIOSNotification(id, title, message, data, options),
                /* iOS and Android properties */
                channelId: "default-channel",
                title: title || "",
                message: message || "",
                playSound: true,
                soundName: "default",
                priority: "high",
            });
        }
    };

    buildAndroidNotification = (
        id: any,
        title: any,
        message: any,
        data = {},
        options: {
            largeIcon?: string;
            smallIcon?: string;
            color?: string;
            vibration?: number;
            priority?: string;
            importance?: any;
        } = {}
    ) => {
        return {
            id: id,
            autoCancel: true,
            largeIcon: options.largeIcon || "ic_launcher",
            smallIcon: options.smallIcon || "ic_notification",
            bigText: message || "",
            subText: title || "",
            color: options.color,
            vibrate: true,
            vibration: options.vibration || 300,
            priority: options.priority || "high",
            importance: options.importance || "high", // (optional) set notification importance, default: high,
            data: data,
        };
    };

    buildIOSNotification = (
        id: any,
        title: any,
        message: any,
        data = {},
        options: { alertAction?: "string"; category?: string } = {}
    ) => {
        return {
            alertAction: options.alertAction || "view",
            category: options.category || "",
            userInfo: {
                id: id,
                item: data,
            },
        };
    };

    cancelAllLocalNotifications = () => {
        if (Platform.OS === "ios") {
            PushNotificationIOS.removeAllDeliveredNotifications();
        } else {
            PushNotification.cancelAllLocalNotifications();
        }
    };

    removeDeliveredNotificationByID = (notificationId: any) => {
        console.log("[LocalNotificationService] removeDeliveredNotificationByID: ", notificationId);
        PushNotification.cancelLocalNotifications({ id: `${notificationId}` });
    };

    createChannel = () => {
        PushNotification.createChannel(
            {
                channelId: "default-channel", // (required)
                channelName: "My channel", // (required)
                channelDescription: "A channel to categorise your notifications", // (optional) default: undefined.
                playSound: true, // (optional) default: true
                soundName: "default", // (optional) See `soundName` parameter of `localNotification` function
                importance: 4, // (optional) default: 4. Int value of the Android notification importance
                vibrate: false, // (optional) default: true. Creates the default vibration patten if true.
            },
            (created: any) => console.log(`createChannel returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
        );
    };
}

export const localNotificationService = new LocalNotificationService();
