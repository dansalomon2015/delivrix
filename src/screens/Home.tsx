import React, { FC, useMemo, useRef } from "react";
import { View, StyleSheet, Pressable } from "react-native";
import {
    Avatar,
    Button,
    Container,
    ShopForm,
    ShopItem,
    TextMedium,
    QrCodeModal,
    OutlineButton,
    ShopsList,
} from "@components";
import { Colors, FontSize, rem, ren } from "@utils";
import { useAppSelector } from "@storage";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { MainStackNavigationProps } from "src/navigation/MainStack";
import { Modalize } from "react-native-modalize";
import I18n from "@locales";
import { useStore } from "@hooks";

type Props = MainStackNavigationProps<"Home">;

export const Home: FC<Props> = ({ navigation }) => {
    const user = useAppSelector((state) => state.rootReducer.user!);
    const currentShop = useAppSelector((state) => state.rootReducer.currentShop);

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
                <View style={styles.header}>
                    <Pressable onPress={() => navigation.navigate("Profile")} style={styles.user}>
                        <Avatar item={user} withOnlineStatus />
                        <TextMedium ml={5 * rem} numberOfLines={1} fontSize={FontSize.H4}>
                            {user?.name}
                        </TextMedium>
                    </Pressable>
                    <View style={styles.actions}>
                        <OutlineButton
                            title={I18n.t("home.join_team")}
                            renderLeftIcon={<Icon name="qrcode" color={Colors.dark} size={16 * rem} />}
                            onPress={() => setShowQrCode(true)}
                        />
                    </View>
                </View>
            </View>
            <View style={styles.bottom_container}>
                {!currentShop ? (
                    <View style={styles.create_btn_container}>
                        <Button title={`+ ${I18n.t("shop.create_new_shop")}`} onPress={onOpen} />
                    </View>
                ) : (
                    <View>
                        <ShopItem shop={currentShop} size="lg" />
                        <View style={styles.shopList}>
                            <ShopsList />
                        </View>
                    </View>
                )}
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
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    user: {
        flexDirection: "row",
        alignItems: "center",
        maxWidth: "60%",
    },
    actions: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-end",
    },
    bottom_container: {
        minHeight: 100 * ren,
        padding: 12 * rem,
    },
    create_btn_container: {
        paddingHorizontal: 30,
    },
    shopList: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-end",
    },
});
