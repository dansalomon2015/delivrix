import React, { FC, useMemo, useRef } from "react";
import { View, StyleSheet, Pressable, ActivityIndicator } from "react-native";
import {
    Avatar,
    Button,
    Container,
    ShopForm,
    ShopItem,
    QrCodeModal,
    OutlineButton,
    ShopsList,
    Text,
    DelivriesCard,
    TodaysDeliveries,
    TomorrowDeliveries,
    TextMedium,
} from "@components";
import { Colors, FontSize, rem, ren } from "@utils";
import { useAppSelector } from "@storage";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { MainStackNavigationProps } from "src/navigation/MainStack";
import { Modalize } from "react-native-modalize";
import I18n from "@locales";
import { useStore } from "@hooks";
import FastImage from "react-native-fast-image";

type Props = MainStackNavigationProps<"Home">;

export const Home: FC<Props> = ({ navigation }) => {
    const user = useAppSelector((state) => state.rootReducer.user!);
    const currentShop = useAppSelector((state) => state.rootReducer.currentShop);
    const { loadingShops } = useStore({ userId: user.id });

    const createShopModalRef = useRef<Modalize>(null);

    const [showQrCode, setShowQrCode] = React.useState(false);
    const onOpen = () => {
        createShopModalRef.current?.open();
    };

    const onClose = () => {
        createShopModalRef.current?.close();
    };

    return (
        <Container bgcolor={Colors.primary}>
            <View style={styles.main}>
                {loadingShops ? (
                    <View>
                        <ActivityIndicator color={Colors.primary} size="large" />
                    </View>
                ) : (
                    <View style={[styles.header, !currentShop ? { justifyContent: "center" } : null]}>
                        {!currentShop ? (
                            <View style={styles.create_btn_container}>
                                <View style={styles.image_container}>
                                    <FastImage
                                        style={{ width: 120 * rem, height: 120 * rem }}
                                        source={require("src/assets/images/empty.png")}
                                        resizeMode={FastImage.resizeMode.contain}
                                    />
                                </View>
                                <Text mb={40 * ren} fontSize={FontSize.H5 + 2} textAlign="center">
                                    {I18n.t("shop.no_forthcoming_order")}
                                </Text>

                                <Text mb={20 * ren} fontSize={FontSize.H4 + 2} textAlign="center">
                                    {I18n.t("shop.no_shops")}
                                </Text>
                                <Button title={`+ ${I18n.t("shop.create_new_shop")}`} onPress={onOpen} />
                            </View>
                        ) : (
                            <View>
                                <ShopItem shop={currentShop} size="md" />
                                <TextMedium fontSize={FontSize.H4 - 1} mt={10 * ren} mb={5 * ren}>
                                    {I18n.t("shop.delivries")}
                                </TextMedium>
                                <DelivriesCard />

                                <TodaysDeliveries shop={currentShop} user={user} />

                                <TomorrowDeliveries shop={currentShop} user={user} />
                            </View>
                        )}
                    </View>
                )}
            </View>
            <View style={styles.bottom_container}>
                <View style={styles.user}>
                    <Avatar onPress={() => navigation.navigate("Profile")} item={user} withOnlineStatus />
                    <View style={{ marginLeft: 10 * rem }}>
                        <OutlineButton
                            title={I18n.t("home.join_team")}
                            renderLeftIcon={<Icon name="qrcode" color={Colors.dark} size={16 * rem} />}
                            onPress={() => setShowQrCode(true)}
                            style={{ marginTop: 3 * ren }}
                        />
                    </View>
                </View>
                <View style={styles.actions}>
                    <View style={styles.shopList}>
                        <ShopsList viewAll={() => navigation.navigate("ShopsScreen")} />
                    </View>
                </View>
            </View>

            <Modalize
                ref={createShopModalRef}
                adjustToContentHeight
                keyboardAvoidingBehavior="padding"
                scrollViewProps={{ keyboardShouldPersistTaps: "always" }}
            >
                <ShopForm close={onClose} />
            </Modalize>

            <QrCodeModal visible={showQrCode} close={() => setShowQrCode(false)} />
        </Container>
    );
};

const styles = StyleSheet.create({
    main: {
        // borderBottomLeftRadius: 40,
        // borderBottomRightRadius: 40,
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
        padding: 10 * rem,
    },
    bottom_container: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 12 * rem,
        paddingBottom: 20 * ren,
    },
    user: {
        flexDirection: "row",
        alignItems: "center",
        maxWidth: "60%",
    },
    actions: {
        justifyContent: "flex-end",
    },
    header: {
        minHeight: 100 * ren,
        flex: 1,
    },
    create_btn_container: {
        paddingHorizontal: 30,
    },
    shopList: {
        flex: 1,
        width: "100%",
    },
    image_container: {
        alignItems: "center",
    },
});
