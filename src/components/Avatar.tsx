import React, { FC, useMemo } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Colors, rem, ShopType, SizeType, UserType } from "@utils";
import FastImage from "react-native-fast-image";
import { TextBold } from "./TextBold.styled";
import { useOnlineHook } from "@hooks";

const sizes = {
    xs: 20 * rem,
    sm: 30 * rem,
    md: 40 * rem,
    lg: 60 * rem,
};

const fontSizes = {
    xs: 8 * rem,
    sm: 12 * rem,
    md: 16 * rem,
    lg: 24 * rem,
};

const borderSize = 1 * rem;

interface Props {
    item?: UserType | ShopType;
    size?: SizeType;
    ml?: number;
    mt?: number;
    mb?: number;
    mr?: number;
    withOnlineStatus?: boolean;
    onPress?: () => void;
}

export const Avatar: FC<Props> = ({ item, size = "sm", withOnlineStatus, mr, ml, onPress }) => {
    if (!item) return null;
    const { photo, name } = item;
    const online = useOnlineHook();
    const _size = sizes[size];
    const _fontSize = fontSizes[size];

    const getShort = useMemo(() => {
        return name
            .split(" ")
            .reduce((acc, current) => {
                return (acc += current.charAt(0));
            }, "")
            .split("")
            .splice(0, 2)
            .join("")
            .toUpperCase();
    }, [name]);

    if (!!photo)
        return (
            <TouchableOpacity
                style={[
                    styles.container,
                    styles.bordered,
                    { width: _size + borderSize + 1, height: _size + borderSize + 1, marginLeft: ml, marginRight: mr },
                ]}
                onPress={onPress}
                activeOpacity={onPress ? 0.6 : 1}
            >
                <FastImage
                    style={{ width: _size, height: _size, borderRadius: 100 }}
                    source={{
                        uri: photo,
                        priority: FastImage.priority.high,
                    }}
                    resizeMode={FastImage.resizeMode.contain}
                />
                {withOnlineStatus && (
                    <View style={[styles.online, { backgroundColor: online ? Colors.green : Colors.red }]} />
                )}
            </TouchableOpacity>
        );

    return (
        <TouchableOpacity
            style={[
                styles.text_container,
                styles.bordered,
                { width: _size, height: _size, marginLeft: ml, marginRight: mr },
            ]}
            onPress={onPress}
            activeOpacity={onPress ? 0.6 : 1}
        >
            <TextBold lineHeight={_fontSize} fontSize={_fontSize} color={Colors.dark}>
                {getShort}
            </TextBold>
            {withOnlineStatus && (
                <View style={[styles.online, { backgroundColor: online ? Colors.green : Colors.red }]} />
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: 100,
    },
    text_container: {
        borderRadius: 100,
        backgroundColor: Colors.yellow,
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 5,
    },
    bordered: {
        borderWidth: borderSize,
        borderColor: Colors.white,
    },
    online: {
        width: 10,
        height: 10,
        borderRadius: 20,
        position: "absolute",
        top: 0,
        right: -3,
    },
});
