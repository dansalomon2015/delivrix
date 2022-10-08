import React, { FC } from "react";
import {
    ImageStyle,
    NativeSyntheticEvent,
    StyleProp,
    StyleSheet,
    TextInputFocusEventData,
    TextInputProps,
    TextStyle,
    View,
    ViewStyle,
} from "react-native";
import { TextInput } from "react-native-element-textinput";
import { Colors, FontFamily } from "@utils";

interface Props extends TextInputProps {
    style?: StyleProp<ViewStyle>;
    inputStyle?: StyleProp<TextStyle>;
    labelStyle?: StyleProp<TextStyle>;
    placeholderStyle?: StyleProp<TextStyle>;
    iconStyle?: StyleProp<ImageStyle>;
    textErrorStyle?: StyleProp<TextStyle>;
    textError?: string;
    label?: string;
    showIcon?: boolean;
    numeric?: boolean;
    focusColor?: string;
    onFocus?: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void;
    onBlur?: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void;
    renderRightIcon?: () => JSX.Element | null | undefined;
    renderLeftIcon?: () => JSX.Element | null | undefined;
}

export const Input: FC<Props> = ({
    label,
    placeholderTextColor,
    renderLeftIcon,
    renderRightIcon,
    textError,
    ...props
}) => {
    return (
        <View style={styles.container}>
            <TextInput
                {...props}
                style={[styles.input, props.style]}
                inputStyle={styles.inputStyle}
                labelStyle={styles.labelStyle}
                placeholderStyle={styles.placeholderStyle}
                textErrorStyle={styles.textErrorStyle}
                label={label}
                placeholderTextColor={placeholderTextColor || "gray"}
                fontFamily={FontFamily.Regular}
                renderLeftIcon={renderLeftIcon}
                renderRightIcon={renderRightIcon}
                textError={textError}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {},
    input: {
        height: 60,
        paddingHorizontal: 12,
        borderRadius: 8,
        backgroundColor: Colors.white,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2,
        borderWidth: 0.3,
    },
    inputStyle: { fontSize: 16, color: Colors.dark, lineHeight: 22 },
    labelStyle: { fontSize: 14, color: Colors.dark },
    placeholderStyle: { fontSize: 16, color: Colors.dark },
    textErrorStyle: { fontSize: 14, textAlign: "right", marginTop: 5, fontFamily: FontFamily.Bold },
});
