import React, { FC } from "react";
import { Modal, ModalProps, StyleSheet, View } from "react-native";
import { Colors, entireScreenWidth, rem } from "@utils";

interface Props extends ModalProps {
    onClose?: () => void;
}

export const ModalContainer: FC<Props> = ({ children, ...props }) => {
    return (
        <Modal animationType="slide" {...props} onRequestClose={props.onClose}>
            <View style={styles.container}>{children}</View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.6)",
        alignItems: "center",
        justifyContent: "center",
    },
});
