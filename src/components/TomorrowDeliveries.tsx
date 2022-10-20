import React, { FC, useMemo } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { Colors, isTomorrow, ren, ShopType, UserType } from "@utils";
import { useStore } from "@hooks";
import { DeliveriesList } from "./DeliveryList";
import I18n from "@locales";
import { Text } from "./Text.styled";

export const TomorrowDeliveries: FC<{ shop: ShopType; user: UserType }> = ({ user, shop }) => {
    const { isAdmin, pendingDeliveries, userPendingDeliveries, loadingUserPendingDeliveries } = useStore({
        userId: user.id,
        shopId: shop.id,
        memberUserId: user.id,
    });

    const getData = useMemo(() => {
        let list = isAdmin ? pendingDeliveries : userPendingDeliveries;
        return list
            .filter((order) => isTomorrow(order.deliveryDate))
            .sort((a, b) => (a.deliveryDate > b.deliveryDate ? 1 : -1));
    }, [isAdmin, pendingDeliveries, userPendingDeliveries]);

    if (loadingUserPendingDeliveries) return <></>;

    if (!getData.length) return null;

    return (
        <>
            <Text mb={5 * ren} mt={10 * ren}>
                {I18n.t("shop.tomorrow")} ({getData.length}){" "}
            </Text>
            <DeliveriesList data={getData} renderItem={undefined} />
        </>
    );
};

const styles = StyleSheet.create({});
