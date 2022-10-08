import React, { FC } from "react";
import { Pressable, StyleSheet, View, ViewStyle } from "react-native";
import { Colors } from "src/utils";
import { Text } from "./Text.styled";

interface Props {
    title: string;
    renderLeftIcon?: JSX.Element;
    style?: ViewStyle;
    onPress?: () => void;
}

export const OutlineButton: FC<Props> = ({ title, renderLeftIcon, style, onPress }) => {
    return (
        <Pressable style={[styles.container, style]} onPress={onPress}>
            {renderLeftIcon && <View style={{ marginRight: 5 }}>{renderLeftIcon}</View>}
            <Text>{title}</Text>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        borderColor: Colors.dark,
        borderWidth: 1,
        borderRadius: 100,
        paddingHorizontal: 10,
    },
});
