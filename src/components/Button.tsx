import React, { FC } from "react";
import { ActivityIndicator, StyleSheet, TouchableHighlight, TouchableHighlightProps, View } from "react-native";
import { Colors, FontSize, rem } from "@utils";
import { TextBold } from "./TextBold.styled";

interface Props extends TouchableHighlightProps {
    title: string;
    loading?: boolean;
}

export const Button: FC<Props> = ({ title, onPress, style, loading, ...props }) => {
    return (
        <TouchableHighlight
            {...props}
            style={[styles.button_container, style]}
            onPress={onPress}
            underlayColor={props.underlayColor || Colors.primary_light}
        >
            {loading ? (
                <ActivityIndicator color={Colors.dark} size="small" />
            ) : (
                <TextBold textAlign="center" fontSize={FontSize.H4}>
                    {title}
                </TextBold>
            )}
        </TouchableHighlight>
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
        paddingVertical: 8 * rem,
        borderRadius: 8,
    },
});
