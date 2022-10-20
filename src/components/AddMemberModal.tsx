import React, { useState } from "react";
import { Modal, StyleSheet, View } from "react-native";
import { Colors, entireScreenHeight, entireScreenWidth, rem, ROLES, ShopType, UserType } from "@utils";
import { Container } from "./Container";
import I18n from "@locales";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import QRCodeScanner from "react-native-qrcode-scanner";
import { RNCamera } from "react-native-camera";
import { getUserbyId, updateMembership } from "@api";
import { Loader } from "./Loader";
import { DialogBox } from "./DialogBox";
import Toast from "react-native-toast-message";
import { ModalCloseButton } from "./ModalCloseButton";

export const AddMemberModal: React.FC<{ visible?: boolean; close: () => void; shop: ShopType }> = ({
    visible,
    close,
    shop,
}) => {
    if (!visible) return null;
    let scannerRef: QRCodeScanner | null;

    const [loading, setLoading] = useState(false);
    const [torch, toggle_torh] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const onSuccess = (e: { data: string }) => {
        const { data } = e;
        setLoading(true);
        getUserbyId(data)
            .then(async (document) => {
                let user = document.data() as UserType;
                let id = user.id + "_" + shop.id;
                if (user) {
                    await updateMembership({
                        id,
                        user,
                        shop,
                        roles: [ROLES.MEMBER],
                        createdAt: new Date().getTime(),
                    });
                    Toast.show({
                        type: "success",
                        text1: I18n.t("dialog.new_member"),
                        text2: I18n.t("dialog.add_success", { username: user.name }),
                    });
                    close();
                } else {
                    setErrorMsg(I18n.t("error.unable_to_find"));
                }
            })
            .catch(() => {
                setErrorMsg(I18n.t("error.unable_to_add"));
            })
            .finally(() => setLoading(false));
    };
    return (
        <Modal visible={true} animationType="slide">
            <Container>
                <View style={styles.button_container}>
                    <Icon
                        name={torch ? "flashlight-off" : "flashlight"}
                        color={Colors.white}
                        size={24 * rem}
                        onPress={() => toggle_torh(!torch)}
                    />
                    <ModalCloseButton onPress={close} />
                </View>
                <QRCodeScanner
                    onRead={onSuccess}
                    ref={(ref) => (scannerRef = ref)}
                    showMarker={true}
                    flashMode={torch ? RNCamera.Constants.FlashMode.torch : RNCamera.Constants.FlashMode.off}
                    cameraStyle={{ height: entireScreenHeight }}
                />
            </Container>
            <Loader loading={loading} />
            <DialogBox
                visible={!!errorMsg}
                message={errorMsg}
                cancelText={I18n.t("dialog.cancel")}
                acceptText={I18n.t("dialog.retry")}
                onCancel={() => {
                    setErrorMsg("");
                    close();
                }}
                onAccept={() => {
                    scannerRef?.reactivate();
                    setErrorMsg("");
                }}
            />
        </Modal>
    );
};

const styles = StyleSheet.create({
    button_container: {
        flexDirection: "row",
        justifyContent: "space-between",
        position: "absolute",
        width: entireScreenWidth,
        top: 0,
        right: 0,
        zIndex: 1000,
        padding: 16 * rem,
    },
    qr_container: {
        alignItems: "center",
        flex: 1,
        justifyContent: "center",
    },
});
