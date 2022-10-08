import React, { FC, ReactNode } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Colors, FontSize, rem, ren } from "@utils";
import { TextMedium } from "./TextMedium.styled";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

interface Props {
    title: string;
    onBackPress?: () => void;
    renderRight?: ReactNode;
}

export const Navbar: FC<Props> = ({ title, onBackPress, renderRight }) => {
    return (
        <View style={styles.container}>
            <Pressable style={styles.header} onPress={onBackPress}>
                <Icon name="arrow-left" color={Colors.dark} size={24 * rem} />
                <TextMedium ml={10} fontSize={FontSize.H3}>
                    {title}
                </TextMedium>
            </Pressable>

            {renderRight}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: 60 * ren,
        alignItems: "center",
        paddingHorizontal: 10 * rem,
        flexDirection: "row",
        justifyContent: "space-between",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
    },
});
