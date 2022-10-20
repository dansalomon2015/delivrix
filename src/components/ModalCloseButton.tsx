import { Pressable, StyleSheet } from "react-native";
import React, { FC } from "react";
import { Colors, rem } from "@utils";
import I18n from "@locales";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Text } from "./Text.styled";

export const ModalCloseButton: FC<{ onPress?: () => void; title?: string }> = ({ onPress, title }) => {
    return (
        <Pressable style={styles.button} onPress={onPress}>
            <Text mr={5}>{title || I18n.t("dialog.close")}</Text>
            <Icon name="close-circle-outline" color={Colors.dark} size={16 * rem} />
        </Pressable>
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
});
