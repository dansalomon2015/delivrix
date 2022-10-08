import React, { FC, useState } from "react";
import { View, StyleSheet, TouchableHighlight } from "react-native";
import { TextBold } from "./TextBold.styled";
import { Colors, FIREBASE_GMAIL_WEB_CLIENT, FontSize, rem, UserType } from "@utils";
import { GoogleSignin, statusCodes } from "@react-native-google-signin/google-signin";
import { useDispatch } from "react-redux";
import { storeUser, updateLaunchStatus } from "@storage";
import Icon from "react-native-vector-icons/Fontisto";
import I18n from "@locales";
import { DialogBox } from "./DialogBox";
import { getUserbyId, updateUser } from "@api";

export const LoginButton: FC<{ setLoading: (value: boolean) => void }> = ({ setLoading }) => {
    const dispatch = useDispatch();
    const [errorDialog, showErrorDialog] = useState(false);

    const _login = async () => {
        GoogleSignin.configure({
            webClientId: FIREBASE_GMAIL_WEB_CLIENT,
            offlineAccess: false,
            forceCodeForRefreshToken: true,
        });
        try {
            await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
            let isSignedIn = await GoogleSignin.isSignedIn();
            if (isSignedIn) {
                await GoogleSignin.signOut();
            }
            const userInfo = await GoogleSignin.signIn();

            // @ts-ignore
            let user: UserType = {
                ...userInfo.user,
                updatedAt: new Date().getTime(),
                createdAt: new Date().getTime(),
            };

            setLoading(true);

            getUserbyId(user.id)
                .then((document) => {
                    let data = document.data();
                    // If user already exist
                    if (data) {
                        user.createdAt = data.createdAt;
                    }
                    updateUser(user)
                        .then(() => {
                            dispatch(storeUser(user));
                            dispatch(updateLaunchStatus(false));
                        })
                        .catch((e) => {
                            setLoading(false);
                            showErrorDialog(true);
                        });
                })
                .catch((e) => {
                    setLoading(false);
                    showErrorDialog(true);
                });
        } catch (error: any) {
            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                // user cancelled the login flow
            } else if (error.code === statusCodes.IN_PROGRESS) {
                showErrorDialog(true);
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                // play services not available or outdated
            } else {
                showErrorDialog(true);
            }
        }
    };

    return (
        <View style={styles.container}>
            <TouchableHighlight style={styles.button_container} onPress={_login} underlayColor={Colors.primary_light}>
                <View style={styles.button}>
                    <Icon name="google" color={Colors.dark} size={16 * rem} />
                    <TextBold ml={30 * rem} fontSize={FontSize.H4}>
                        {I18n.t("launcher.login_gmail")}
                    </TextBold>
                </View>
            </TouchableHighlight>

            <DialogBox
                message={I18n.t("error.unknown_error")}
                visible={errorDialog}
                onAccept={() => showErrorDialog(false)}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
    },
    button: {
        flexDirection: "row",
        alignItems: "center",
    },
    button_container: {
        backgroundColor: Colors.yellow,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2,
        paddingHorizontal: 20 * rem,
        paddingVertical: 15 * rem,
        borderRadius: 8,
    },
});
