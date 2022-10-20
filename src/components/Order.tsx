import React, { FC } from "react";
import { StyleSheet, View } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Colors, FontSize, rem } from "src/utils";
import { TextBold } from "./TextBold.styled";

export const Order: FC<{ order: number; validated?: boolean }> = ({ order, validated }) => {
    if (validated)
        return <Icon name="check-circle" color={Colors.primary} size={22 * rem} style={{ marginRight: 3 * rem }} />;
    return (
        <View style={styles.container}>
            <TextBold color={Colors.white} lineHeight={FontSize.normal} fontSize={FontSize.normal - 1}>
                {order}
            </TextBold>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: 20 * rem,
        height: 20 * rem,
        borderRadius: 50,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: Colors.dark,
        marginRight: 5 * rem,
        marginLeft: 4 * rem,
    },
});
