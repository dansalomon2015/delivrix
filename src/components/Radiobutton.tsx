import React, { FC } from "react";
import { Pressable, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Colors, FontSize, rem } from "@utils";
import { Text } from "./Text.styled";

export const Radiobutton: FC<{ checked?: boolean; title: string; onPress: () => void }> = ({
    title,
    checked,
    onPress,
}) => {
    return (
        <Pressable onPress={onPress} style={styles.container}>
            <Icon
                name={checked ? "radiobox-marked" : "radiobox-blank"}
                size={24 * rem}
                color={checked ? Colors.primary : Colors.dark}
            />
            <Text ml={5 * rem} fontSize={FontSize.normal + 2} lineHeight={FontSize.H3}>
                {title}
            </Text>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
    },
});
