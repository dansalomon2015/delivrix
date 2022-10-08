import React, { FC, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Container, DialogBox, Navbar, TextBold } from "@components";
import { Colors, rem } from "@utils";
import I18n from "@locales";
import { MainStackNavigationProps } from "src/navigation/MainStack";
import { useDispatch } from "react-redux";
import { logout } from "@storage";

type Props = MainStackNavigationProps<"Profile">;

export const Profile: FC<Props> = ({ navigation }) => {
    const dispatch = useDispatch();

    const [logoutDialogVisible, setLogoutDialogVisible] = useState(false);

    return (
        <Container>
            <Navbar
                title={I18n.t("profile._")}
                onBackPress={() => navigation.goBack()}
                renderRight={
                    <TextBold onPress={() => setLogoutDialogVisible(true)}>{I18n.t("profile.logout")}</TextBold>
                }
            />

            <DialogBox
                title={I18n.t("profile.confirm_logout")}
                message={I18n.t("profile.want_logout")}
                visible={logoutDialogVisible}
                cancelText={I18n.t("dialog.no")}
                acceptText={I18n.t("dialog.yes")}
                onCancel={() => setLogoutDialogVisible(false)}
                onAccept={() => dispatch(logout())}
            />
        </Container>
    );
};

const styles = StyleSheet.create({});
