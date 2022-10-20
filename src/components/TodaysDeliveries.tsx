import React, { FC, useMemo } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { Colors, isToday, ren, ShopType, UserType } from "@utils";
import { useStore } from "@hooks";
import { DeliveriesList } from "./DeliveryList";
import { Text } from "./Text.styled";
import I18n from "@locales";

export const TodaysDeliveries: FC<{ shop: ShopType; user: UserType }> = ({ user, shop }) => {
    const { isAdmin, pendingDeliveries, userPendingDeliveries, loadingUserPendingDeliveries } = useStore({
        userId: user.id,
        shopId: shop.id,
        memberUserId: user.id,
    });

    const getData = useMemo(() => {
        let list = isAdmin ? pendingDeliveries : userPendingDeliveries;
        return list
            .filter((order) => isToday(order.deliveryDate))
            .sort((a, b) => (a.deliveryDate > b.deliveryDate ? 1 : -1));
    }, [isAdmin, pendingDeliveries, userPendingDeliveries]);

    if (loadingUserPendingDeliveries)
        return (
            <View>
                <ActivityIndicator color={Colors.primary} size={"large"} />
            </View>
        );

    return (
        <>
            <Text mb={5 * ren}>
                {I18n.t("shop.today")} ({getData.length}){" "}
            </Text>
            <DeliveriesList data={getData} renderItem={undefined} />
        </>
    );
};

const styles = StyleSheet.create({});
