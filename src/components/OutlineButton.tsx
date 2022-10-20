import React, { FC } from "react";
import { StyleSheet, TouchableHighlight, View, ViewStyle } from "react-native";
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
        <TouchableHighlight style={[styles.container, style]} onPress={onPress} underlayColor={Colors.light_gray}>
            <View style={styles.content}>
                {renderLeftIcon && <View style={{ marginRight: !!title ? 5 : 0 }}>{renderLeftIcon}</View>}
                {!!title && <Text>{title}</Text>}
            </View>
        </TouchableHighlight>
    );
};

const styles = StyleSheet.create({
    container: {
        borderColor: Colors.dark,
        borderWidth: 1,
        borderRadius: 100,
        paddingHorizontal: 10,
    },
    content: {
        flexDirection: "row",
        alignItems: "center",
    },
});
