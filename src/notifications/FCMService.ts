import messaging from "@react-native-firebase/messaging";
import { Platform } from "react-native";

export class FCMService {
    register = (
        onRegister: (fcmToken?: string) => void,
        onNotification: (notification: any) => void,
        onOpenNotification: (notification: any) => void
    ) => {
        this.checkPermission(onRegister);
        this.createNotificationListeners(onRegister, onNotification, onOpenNotification);
    };

    registerAppWithFCM = async () => {
        if (Platform.OS === "ios") {
            await messaging().registerDeviceForRemoteMessages();
            await messaging().setAutoInitEnabled(true);
        }
    };

    checkPermission = (onRegister: () => void) => {
        messaging()
            .hasPermission()
            .then((enabled) => {
                if (enabled) {
                    // User has permissions
                    this.getToken(onRegister);
                } else {
                    // User doesn't have permission
                    this.requestPermission(onRegister);
                }
            })
            .catch((error) => {
                console.log("[FCMService] Permission rejected ", error);
            });
    };

    getToken = (onRegister: (fcmToken?: string) => void) => {
        messaging()
            .getToken()
            .then((fcmToken) => {
                if (fcmToken) {
                    onRegister(fcmToken);
                } else {
                    console.log("[FCMService] User does not have a device token");
                }
            })
            .catch((error) => {
                console.log("[FCMService] getToken rejected ", error);
            });
    };

    getAsyncToken = async (onRegister: (fcmToken?: string) => void) => {
        try {
            const fcmToken_1 = await messaging().getToken();
            if (fcmToken_1) {
                onRegister(fcmToken_1);
            } else {
                console.log("[FCMService] User does not have a device token");
            }
        } catch (error) {
            console.log("[FCMService] getToken rejected ", error);
        }
    };

    requestPermission = (onRegister: (fcmToken?: string) => void) => {
        messaging()
            .requestPermission()
            .then(() => {
                this.getToken(onRegister);
            })
            .catch((error) => {
                console.log("[FCMService] Request Permission rejected ", error);
            });
    };

    deleteToken = () => {
        console.log("[FCMService] deleteToken ");
        messaging()
            .deleteToken()
            .catch((error) => {
                console.log("[FCMService] Delete token error ", error);
            });
    };

    suscribeTopic = (topic: string) => {
        messaging()
            .subscribeToTopic(topic)
            .then(() => console.log("Subscribed to topic!"));
    };

    unSuscribeTopic = (topic: string) => {
        messaging()
            .unsubscribeFromTopic(topic)
            .then(() => console.log("unSubscribed to topic!"));
    };

    createNotificationListeners = (
        onRegister: (fcmToken?: string) => void,
        onNotification: (notification: any) => void,
        onOpenNotification: (notification: any) => void
    ) => {
        // When the application is running, but in the background
        messaging().onNotificationOpenedApp(async (remoteMessage) => {
            console.log(
                "[FCMService] onNotificationOpenedApp Notification caused app to open from background state:",
                remoteMessage
            );
            if (remoteMessage) {
                const notification = remoteMessage.notification;
                onOpenNotification(notification);
                // this.removeDeliveredNotification(notification.notificationId)
            }
        });

        // When the application is opened from a quit state.
        messaging()
            .getInitialNotification()
            .then((remoteMessage) => {
                console.log(
                    "[FCMService] getInitialNotification Notification caused app to open from quit state:",
                    remoteMessage
                );

                if (remoteMessage) {
                    const notification: any = remoteMessage.notification;
                    notification.data = remoteMessage.data;
                    onOpenNotification(notification);
                    //  this.removeDeliveredNotification(notification.notificationId)
                }
            });

        // Foreground state messages
        const messageListener = messaging().onMessage(async (remoteMessage) => {
            console.log("APP Notification ===> ", remoteMessage);
            if (remoteMessage) {
                let notification: any = null;
                if (Platform.OS === "ios") {
                    notification = remoteMessage.data;
                } else {
                    notification = remoteMessage.notification;
                    notification.data = remoteMessage.data;
                }
                onNotification(notification);
            }
        });

        // Triggered when have new token
        messaging().onTokenRefresh((fcmToken) => {
            // console.log("[FCMService] New token refresh: ", fcmToken);
            onRegister(fcmToken);
        });
    };

    // unRegister = () => {
    //     messageListener;
    // };
}
