import React, { FC, useEffect, useMemo, useRef } from "react";
import { Linking, Modal, ModalProps, StyleSheet, View } from "react-native";
import { Modalize } from "react-native-modalize";
import { Colors, FontSize, OrderType, PaymentMethods, rem, ren } from "@utils";
import FeatherIcon from "react-native-vector-icons/Feather";
import { TextBold } from "./TextBold.styled";
import { TextMedium } from "./TextMedium.styled";
import IonIcon from "react-native-vector-icons/Ionicons";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Text } from "./Text.styled";
import { TextLight } from "./TextLight.styled";

interface Props extends ModalProps {
    onClose: () => void;
    visible: boolean;
    delivery: OrderType;
}

export const DeliveryDetailsModal: FC<Props> = ({ visible, onClose, delivery, ...props }) => {
    const modalRef = useRef<Modalize>(null);

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

    useEffect(() => {
        if (visible) {
            modalRef.current?.open();
        } else {
            modalRef.current?.close();
        }
    }, [visible]);

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
        <Modal transparent visible={visible} animationType="slide" {...props} onRequestClose={onClose}>
            <View style={{ flex: 1 }}>
                <Modalize
                    ref={modalRef}
                    adjustToContentHeight
                    keyboardAvoidingBehavior="padding"
                    scrollViewProps={{ keyboardShouldPersistTaps: "always" }}
                    onBackButtonPress={() => {
                        onClose();
                        return true;
                    }}
                    onOverlayPress={onClose}
                >
                    <View style={styles.container}>
                        <View style={styles.close}>
                            <Icon size={24 * rem} name="close-circle" onPress={onClose} color={Colors.dark} />
                        </View>
                        <View style={styles.row}>
                            <FeatherIcon name="shopping-cart" size={14 * rem} style={{ marginTop: 6 * ren }} />
                            <View style={styles.products}>
                                {products.map((product) => {
                                    const { name, quantity, id } = product;
                                    return (
                                        <View style={styles.productItem} key={id}>
                                            <TextBold fontSize={FontSize.normal} lineHeight={FontSize.small + 5}>
                                                {name} ({quantity})
                                            </TextBold>
                                        </View>
                                    );
                                })}
                            </View>
                        </View>
                        <View style={[styles.row, { marginTop: 10 * ren }]}>
                            <FeatherIcon name="map-pin" size={14 * rem} />
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
                        <View style={styles.client}>
                            <View>
                                <TextLight fontSize={FontSize.small} lineHeight={FontSize.normal + 2}>
                                    Client
                                </TextLight>
                                <Text fontSize={FontSize.normal} lineHeight={FontSize.normal + 2}>
                                    {name}
                                </Text>
                            </View>

                            <View style={[styles.row, { alignItems: "center" }]}>
                                <IonIcon
                                    name="ios-logo-whatsapp"
                                    size={24 * rem}
                                    color={Colors.whatsapp}
                                    style={{ marginRight: 20 * rem }}
                                    onPress={() => Linking.openURL(`whatsapp://send?text=&phone=${phone}`)}
                                />
                                <FeatherIcon
                                    name="phone"
                                    size={22 * rem}
                                    color={Colors.dark}
                                    onPress={() => Linking.openURL(`tel:${phone}`)}
                                />
                            </View>
                        </View>
                    </View>
                </Modalize>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16 * rem,
    },
    row: {
        flexDirection: "row",
        alignItems: "flex-start",
    },
    productItem: {
        backgroundColor: Colors.light_gray,
        paddingHorizontal: 6 * rem,
        paddingVertical: 2 * ren,
        borderRadius: 20,
        marginRight: 10 * rem,
        marginTop: 4 * ren,
    },
    products: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginLeft: 5 * rem,
    },
    client: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderWidth: 0.5,
        borderColor: Colors.dark,
        paddingHorizontal: 8 * rem,
        paddingVertical: 10,
        borderRadius: 4,
        marginVertical: 10 * ren,
    },
    close: {
        position: "absolute",
        top: 10,
        right: 10,
    },
});
