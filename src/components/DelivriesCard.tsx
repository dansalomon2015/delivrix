import React, { useState } from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { Colors, FontSize, rem, ren } from "@utils";
import I18n from "@locales";
import { TextMedium } from "./TextMedium.styled";
import { TextBold } from "./TextBold.styled";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { OrderFormModal } from "./OrderFormModal";
import { useAppSelector } from "@storage";
import { Text } from "./Text.styled";
import { useStore } from "@hooks";

export const DelivriesCard = () => {
    const shop = useAppSelector((state) => state.rootReducer.currentShop);
    const user = useAppSelector((state) => state.rootReducer.user);
    const { pendingDeliveries, notAssignedDeliveries } = useStore({ shopId: shop?.id });
    const { isAdmin } = useStore({ userId: user?.id, shopId: shop?.id });
    const [showModal, setShowModal] = useState(false);

    if (!isAdmin) return null;

    return (
        <View style={styles.container}>
            <View>
                <View style={styles.counters}>
                    <View style={[styles.stat, { marginRight: 10 * rem }]}>
                        <TextBold lineHeight={FontSize.H3} fontSize={FontSize.H4}>
                            {notAssignedDeliveries.length}
                        </TextBold>
                        <Text lineHeight={FontSize.H4} fontSize={FontSize.H5 + 2}>
                            {I18n.t("shop.not_assigned")}
                        </Text>
                    </View>
                    <View style={styles.stat}>
                        <TextBold lineHeight={FontSize.H3} fontSize={FontSize.H4}>
                            {pendingDeliveries.length}
                        </TextBold>
                        <Text lineHeight={FontSize.H4} fontSize={FontSize.H5 + 2}>
                            {I18n.t("shop.pending")}
                        </Text>
                    </View>
                </View>
            </View>
            <View>
                <TouchableOpacity style={styles.button} activeOpacity={0.8} onPress={() => setShowModal(true)}>
                    <View style={{ alignItems: "flex-end" }}>
                        <Icon name="shape-square-plus" size={18 * rem} />
                    </View>
                    <Text lineHeight={FontSize.H4} fontSize={FontSize.H5 + 2}>
                        {I18n.t("shop.new_delivry")}
                    </Text>
                </TouchableOpacity>
            </View>

            {showModal && <OrderFormModal shop={shop!} visible={showModal} close={() => setShowModal(false)} />}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 10 * ren,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-end",
    },
    counters: {
        flexDirection: "row",
        alignItems: "center",
    },
    button: {
        backgroundColor: Colors.light_gray,
        borderRadius: 10,
        padding: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 3,
        borderWidth: 0.5,
        borderColor: Colors.grey,
    },
    stat: {
        backgroundColor: Colors.yellow,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 3,
        width: 85 * rem,
        padding: 10 * rem,
    },
});
