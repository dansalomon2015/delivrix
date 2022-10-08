import React, { FC } from "react";
import { Modal, Pressable, StyleSheet, View } from "react-native";
import { useAppSelector } from "@storage";
import QRCode from "react-native-qrcode-svg";
import { Colors, FontSize, rem, ren } from "@utils";
import { Container } from "./Container";
import { Text } from "./Text.styled";
import I18n from "@locales";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { TextMedium } from "./TextMedium.styled";

export const QrCodeModal: FC<{ visible?: boolean; close: () => void }> = ({ visible, close }) => {
    const user = useAppSelector((state) => state.rootReducer.user!);

    if (!visible) return null;

    return (
        <Modal visible={true} animationType="slide">
            <Container padding={16 * rem}>
                <View style={styles.button_container}>
                    <Pressable style={styles.button} onPress={close}>
                        <Text mr={5}>{I18n.t("dialog.close")}</Text>
                        <Icon name="close-circle-outline" color={Colors.dark} size={16 * rem} />
                    </Pressable>
                </View>
                <View style={styles.qr_container}>
                    <QRCode value={user.id} color={Colors.dark} size={200 * rem} />
                    <TextMedium fontSize={FontSize.H2} lineHeight={FontSize.H2 + 10} mt={100 * ren} textAlign="center">
                        {I18n.t("shop.scan_to_add")}
                    </TextMedium>
                </View>
            </Container>
        </Modal>
    );
};

const styles = StyleSheet.create({
    button: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: Colors.primary,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 100,
    },
    button_container: {
        flexDirection: "row",
        justifyContent: "flex-end",
    },
    qr_container: {
        alignItems: "center",
        flex: 1,
        justifyContent: "center",
    },
});
