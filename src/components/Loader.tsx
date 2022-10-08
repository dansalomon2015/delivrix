import { View, StyleSheet, ActivityIndicator } from "react-native";
import React, { FC } from "react";
import { Colors, entireScreenHeight, entireScreenWidth, FontSize, rem } from "@utils";
import { Text } from "./Text.styled";

export const Loader: FC<{ loading?: boolean; text?: string }> = ({ loading, text }) => {
    if (!loading) return null;

    return (
        <View style={styles.container}>
            {!text ? (
                <ActivityIndicator color={Colors.primary} size="large" />
            ) : (
                <View style={styles.withText}>
                    <ActivityIndicator color={Colors.primary} size="large" />
                    <Text fontSize={FontSize.H4} ml={20}>
                        {text}
                    </Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        width: entireScreenWidth,
        height: entireScreenHeight,
        backgroundColor: "rgba(0,0,0, .6)",
        justifyContent: "center",
        alignItems: "center",
        top: 0,
        left: 0,
    },
    withText: {
        backgroundColor: Colors.white,
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
        borderRadius: 10,
        flexDirection: "row",
        alignItems: "center",
    },
});
