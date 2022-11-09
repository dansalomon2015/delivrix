import React from "react";
import { Linking, StyleSheet, View } from "react-native";
import { Text, Container, TextBold, LoginButton, Loader, TextMedium } from "@components";
import { Colors, entireScreenHeight, entireScreenWidth, FontSize, rem, ren } from "@utils";
import AppIntroSlider from "react-native-app-intro-slider";
import FastImage from "react-native-fast-image";
import I18n from "@locales";

export const Welcome = () => {
    const [loading, setLoading] = React.useState(false);

    const _renderItem = (data: any) => {
        const {
            item: { title, image, text },
        } = data;
        return (
            <View style={styles.slide}>
                <FastImage source={image} style={styles.image} resizeMode={FastImage.resizeMode.contain} />
                <TextBold textAlign="center" fontSize={FontSize.H3}>
                    {title}
                </TextBold>
                <Text mt={10} textAlign="center" fontSize={FontSize.H4}>
                    {text}
                </Text>
            </View>
        );
    };

    const privacy = () => {
        Linking.openURL("https://www.freeprivacypolicy.com/live/d5f02dff-d929-458d-893e-9aa65c63d898");
    };

    const slides = [
        {
            key: "one",
            title: I18n.t("launcher.manage_orders"),
            text: I18n.t("launcher.and_delivry_process"),
            image: require("src/assets/images/take_orders.png"),
            backgroundColor: Colors.white,
        },
        {
            key: "two",
            title: I18n.t("launcher.register_orders"),
            text: I18n.t("launcher.and_assing_delivry"),
            image: require("src/assets/images/take_orders.png"),
            backgroundColor: Colors.white,
        },
        {
            key: "three",
            title: I18n.t("launcher.follow_delivry_status"),
            text: I18n.t("launcher.in_realtime"),
            image: require("src/assets/images/take_orders.png"),
            backgroundColor: Colors.white,
        },
    ];

    return (
        <Container bgcolor={Colors.primary} testID="welcome">
            <View style={styles.main}>
                <AppIntroSlider
                    renderItem={_renderItem}
                    data={slides}
                    showSkipButton
                    activeDotStyle={{ backgroundColor: Colors.primary }}
                />
            </View>
            <View style={styles.bottom}>
                <LoginButton setLoading={setLoading} />

                <TextMedium fontSize={12 * rem} color={Colors.dark} textAlign="center" mt={10}>
                    {I18n.t("launcher.condition_text")}{" "}
                    <Text
                        fontSize={12 * rem}
                        onPress={privacy}
                        style={[{ color: "blue", textDecorationLine: "underline" }]}
                    >
                        {I18n.t("launcher.privacy")}
                    </Text>
                </TextMedium>
            </View>
            <Loader loading={loading} />
        </Container>
    );
};

const styles = StyleSheet.create({
    main: {
        borderBottomLeftRadius: 40,
        borderBottomRightRadius: 40,
        backgroundColor: Colors.white,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        flex: 1,
    },
    image: {
        width: entireScreenWidth * 0.8,
        height: undefined,
        aspectRatio: 1 / 1,
    },
    btn_container: {
        paddingBottom: 40 * ren,
        paddingHorizontal: 30 * rem,
    },
    buttonCircle: {
        width: 40,
        height: 40,
        backgroundColor: "rgba(0, 0, 0, .2)",
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
    },
    slide: {
        flex: 1,
        alignItems: "center",
        paddingTop: entireScreenHeight / 10,
    },
    bottom: {
        padding: 30 * rem,
    },
});
