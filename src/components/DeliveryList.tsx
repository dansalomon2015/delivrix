import React, { FC, useMemo, useState } from "react";
import { FlatListProps, Linking, StyleSheet, TouchableNativeFeedback, View } from "react-native";
import {
    Colors,
    DELIVERY_ITEM_WIDTH,
    FontSize,
    formatAmount,
    getTimeFromDate,
    OrderType,
    PaymentMethods,
    rem,
    ren,
} from "@utils";
import { FlatList } from "react-native-gesture-handler";
import { Text } from "./Text.styled";
import { TextBold } from "./TextBold.styled";
import FeatherIcon from "react-native-vector-icons/Feather";
import IonIcon from "react-native-vector-icons/Ionicons";
import { TextMedium } from "./TextMedium.styled";
import { DeliveryDetailsModal } from "./DeliveryDetailsModal";

interface Props extends FlatListProps<OrderType> {}

export const DeliveriesList: FC<Props> = ({ ...props }) => {
    return (
        <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            {...props}
            renderItem={({ item }) => {
                const { id } = item;
                return <DeliveryItem delivery={item} key={id} />;
            }}
            keyExtractor={(item) => item.id!.toString()}
            snapToInterval={DELIVERY_ITEM_WIDTH - 10 * rem}
        />
    );
};

export const DeliveryItem: FC<{ delivery: OrderType }> = ({ delivery }) => {
    const {
        assignedTo,
        deliveryDate,
        deliveryFee,
        toPaid,
        client: { name, phone },
        createdAt,
        location,
        products,
        paymentMethod,
    } = delivery;

    const [detailsVisible, setDetailsVisible] = useState(false);

    const getPaymentIconName = useMemo(() => {
        switch (paymentMethod) {
            case PaymentMethods.CARD:
                return "ios-card-outline";
            case PaymentMethods.MOBILE:
                return "phone-portrait-outline";
            default:
                return "ios-cash-outline";
        }
    }, [paymentMethod]);
    return (
        <TouchableNativeFeedback
            onPress={() => setDetailsVisible(true)}
            background={TouchableNativeFeedback.Ripple(Colors.primary_light, false)}
        >
            <View style={styles.container}>
                <View style={{ flex: 1 }}>
                    <View style={styles.header}>
                        <Text fontSize={FontSize.normal} lineHeight={FontSize.normal + 2}>
                            {name}
                        </Text>
                        <View style={styles.time}>
                            <FeatherIcon name="clock" size={12 * rem} style={{ marginRight: 4 }} />
                            <Text fontSize={FontSize.small} lineHeight={FontSize.small + 2}>
                                {getTimeFromDate(new Date(deliveryDate))}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.row}>
                        <FeatherIcon name="shopping-cart" size={14 * rem} style={{ marginTop: 6 * ren }} />
                        <View style={styles.products}>
                            {products.map((product) => {
                                const { name, quantity, id } = product;
                                return (
                                    <View style={styles.productItem} key={id}>
                                        <TextBold fontSize={FontSize.small} lineHeight={FontSize.small + 5}>
                                            {name} ({quantity})
                                        </TextBold>
                                    </View>
                                );
                            })}
                        </View>
                    </View>
                    <View style={[styles.row, { marginTop: 10 * ren }]}>
                        <FeatherIcon name="map-pin" size={13 * rem} />
                        <TextMedium
                            ml={5 * rem}
                            fontSize={FontSize.normal - 1}
                            lineHeight={FontSize.normal + 1}
                            color={Colors.grey}
                            numberOfLines={2}
                        >
                            {location}
                        </TextMedium>
                    </View>
                </View>

                <View style={styles.footer}>
                    <View style={[styles.row, { alignItems: "center", flex: 1 }]}>
                        <IonIcon name={getPaymentIconName} size={16 * rem} color={Colors.primary} />
                        <TextBold
                            ml={5 * rem}
                            fontSize={FontSize.normal + 4}
                            lineHeight={FontSize.normal + 10}
                            color={Colors.primary}
                        >
                            {formatAmount(toPaid)} XAF
                        </TextBold>
                    </View>
                    <View style={[styles.row, { alignItems: "center" }]}>
                        <IonIcon
                            name="ios-logo-whatsapp"
                            size={20 * rem}
                            color={Colors.whatsapp}
                            style={{ marginRight: 10 * rem }}
                            onPress={() => Linking.openURL(`whatsapp://send?text=&phone=${phone}`)}
                        />
                        <FeatherIcon
                            name="phone"
                            size={18 * rem}
                            color={Colors.dark}
                            onPress={() => Linking.openURL(`tel:${phone}`)}
                        />
                    </View>
                </View>
                {detailsVisible && (
                    <DeliveryDetailsModal
                        visible={detailsVisible}
                        onClose={() => setDetailsVisible(false)}
                        delivery={delivery}
                    />
                )}
            </View>
        </TouchableNativeFeedback>
    );
};

const styles = StyleSheet.create({
    container: {
        width: DELIVERY_ITEM_WIDTH,
        padding: 8 * rem,
        marginRight: 10 * rem,
        borderWidth: 1,
        borderColor: Colors.grey,
        borderRadius: 4 * rem,
        minHeight: 180,
        maxHeight: 210,
    },
    row: {
        flexDirection: "row",
        alignItems: "flex-start",
    },
    products: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginLeft: 5 * rem,
    },
    productItem: {
        backgroundColor: Colors.light_gray,
        paddingHorizontal: 6 * rem,
        paddingVertical: 2 * ren,
        borderRadius: 20,
        marginRight: 10 * rem,
        marginTop: 4 * ren,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10 * ren,
    },
    time: {
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "center",
    },
    footer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 10 * ren,
        alignItems: "center",
    },
});
