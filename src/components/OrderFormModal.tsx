import React, { FC, useMemo, useState } from "react";
import { Modal, ScrollView, StyleSheet, View } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import {
    ClientType,
    dateToLocale,
    entireScreenWidth,
    FontSize,
    OrderType,
    ORDER_STATUS,
    PaymentMethods,
    ProductType,
    rem,
    ren,
    ShopType,
    UserType,
} from "@utils";
import { Container } from "./Container";
import I18n from "@locales";
import { TextMedium } from "./TextMedium.styled";
import { OutlineButton } from "./OutlineButton";
import { ModalContainer } from "./ModalContainer";
import { ProductList } from "./ProductList";
import { Cart } from "./Cart";
import { Order } from "./Order";
import { BR } from "./BR.styled";
import { ClientsList } from "./ClientsList";
import { Text } from "./Text.styled";
import { Input } from "./Input";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { MemberList } from "./MemberList";
import { TextBold } from "./TextBold.styled";
import { Button } from "./Button";
import { addOrUpdateOrder } from "src/api";
import { useAppSelector } from "src/storage";
import { Radiobutton } from "./Radiobutton";
import Toast from "react-native-toast-message";
import { Loader } from "./Loader";

interface Props {
    visible?: boolean;
    close: () => void;
    shop: ShopType;
}

export const OrderFormModal: FC<Props> = ({ visible, close, shop }) => {
    const user = useAppSelector((state) => state.rootReducer.user!);
    const [productModalVisible, setProductModalVisible] = useState(false);
    const [memberModalVisible, setMemberModalVisible] = useState(false);
    const [clientModalVisible, setClientModalVisible] = useState(false);
    const [cart, setCart] = useState<ProductType[]>([]);
    const [client, setClient] = useState<ClientType>();
    const [deliveryPerson, setDeliveryPerson] = useState<UserType>();
    const [location, setLocation] = useState("");
    const [loading, setLoading] = useState(false);

    const [calendarVisible, setCalendarVisible] = useState(false);
    const [deliveryDate, setDeliveryDate] = useState("");
    const [discount, setDiscount] = useState(0);
    const [fees, setFees] = useState(0);
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethods>(PaymentMethods.CASH);

    const _total = useMemo(() => {
        return cart.reduce((sum, product) => {
            const { price, quantity } = product;
            return sum + price * quantity;
        }, 0);
    }, [cart]);

    const _due = useMemo(() => {
        let t = _total - discount + fees;
        return t >= 0 ? t : 0;
    }, [_total, fees, discount]);

    const _isDisabled = useMemo(() => {
        return !(!!cart.length && !!deliveryDate && !!client) || loading;
    }, [cart, deliveryPerson, deliveryDate, client]);

    const removeProduct = (productId: string) => {
        let temp = cart.filter((p) => !(p.id === productId));
        setCart(temp);
    };

    const increment = (productId: string) => {
        let temp = [];
        temp = cart.map((p) => {
            if (p.id === productId) {
                p.quantity = p.quantity ? (p.quantity += 1) : 1;
            }
            return p;
        });
        setCart(temp);
    };

    const decrement = (productId: string) => {
        let temp = [];
        temp = cart.map((p) => {
            if (p.id === productId) {
                p.quantity -= 1;
            }
            return p;
        });
        setCart(temp);
    };

    const reset = () => {
        setCart([]);
        setClient(undefined);
        setLocation("");
        if (close) close();
    };

    const hideDatePicker = () => {
        setCalendarVisible(false);
    };

    const handleConfirm = (date: Date) => {
        setDeliveryDate(date.toISOString());
        hideDatePicker();
    };

    const _save = () => {
        setLoading(true);

        let order: OrderType = {
            products: cart,
            client: client!,
            location,
            shop: shop,
            status: deliveryPerson ? ORDER_STATUS.ASSIGNED : ORDER_STATUS.INIT,
            paymentMethod,
            toPaid: _due,
            deliveryDate: new Date(deliveryDate).getTime(),
            deliveryFee: fees,
            createdBy: user,
            assignedTo: deliveryPerson ? deliveryPerson : null,
            createdAt: new Date().getTime(),
        };

        addOrUpdateOrder(order)
            .then(() => {
                Toast.show({
                    type: "success",
                    text1: I18n.t("dialog.success"),
                });
                close();
            })
            .catch((e) => {
                setLoading(false);
            });
    };

    if (!visible) return null;
    return (
        <Modal animationType="slide" onRequestClose={close}>
            <Container>
                <View style={styles.button_container}>
                    <TextMedium lineHeight={FontSize.H3 + 2} fontSize={FontSize.H3 - 4}>
                        {I18n.t("shop.new_delivry_")}
                    </TextMedium>
                    <Icon name="close" onPress={reset} size={24 * rem} />
                </View>
                <ScrollView keyboardShouldPersistTaps="always">
                    <View style={styles.main}>
                        <View style={styles.section_header}>
                            <View style={styles.section_title}>
                                <Order order={1} validated={!!cart.length} />
                                <TextMedium fontSize={FontSize.H4 - 2}>
                                    {I18n.t("shop.products_list")} ({cart.length})
                                </TextMedium>
                            </View>

                            <OutlineButton
                                title={I18n.t("shop.select")}
                                onPress={() => setProductModalVisible(true)}
                                renderLeftIcon={<Icon name="plus" />}
                            />
                        </View>
                        <View style={{ marginLeft: 2 * rem }}>
                            <Cart
                                products={cart}
                                increment={increment}
                                decrement={decrement}
                                onDelete={removeProduct}
                            />
                        </View>
                        {!!cart.length && (
                            <TextMedium lineHeight={FontSize.H4 + 4} textAlign="right" mt={5 * ren}>
                                <Text lineHeight={FontSize.H4 + 4}>Total : </Text> {_total} XAF
                            </TextMedium>
                        )}
                        <BR val={20} />
                        <View style={styles.section_header}>
                            <View style={styles.section_title}>
                                <Order order={2} validated={!!client} />
                                <TextMedium fontSize={FontSize.H4 - 2}>{I18n.t("shop.client")}</TextMedium>
                            </View>

                            <OutlineButton
                                title={I18n.t("shop.select")}
                                onPress={() => setClientModalVisible(true)}
                                renderLeftIcon={<Icon name="account-plus-outline" />}
                            />
                        </View>
                        {!client && (
                            <Text ml={5 * rem}>{I18n.t("shop.no_data_selected", { data: I18n.t("client") })}</Text>
                        )}
                        <View style={styles.client}>
                            <TextMedium fontSize={FontSize.H4 - 2} lineHeight={FontSize.normal + 4}>
                                {client?.name}
                            </TextMedium>
                            <Text fontSize={FontSize.H4 - 2} ml={20 * rem} lineHeight={FontSize.normal + 4}>
                                {client?.phone}
                            </Text>
                        </View>

                        {client && (
                            <Input
                                value={location}
                                onChangeText={setLocation}
                                placeholder={I18n.t("shop.delivry_location")}
                                label={I18n.t("shop.delivry_location")}
                                multiline
                                numberOfLines={4}
                                style={{ marginTop: 20, height: 90 }}
                                editable={!loading}
                            />
                        )}
                        <BR val={25} />
                        <View style={styles.section_header}>
                            <View style={styles.section_title}>
                                <Order order={3} validated={!!deliveryDate} />
                                <TextMedium fontSize={FontSize.H4 - 2}>{I18n.t("shop.delivery_date")}</TextMedium>
                            </View>

                            <OutlineButton
                                title={I18n.t("shop.pick_date")}
                                onPress={() => setCalendarVisible(true)}
                                renderLeftIcon={<Icon name="calendar-clock" />}
                            />
                        </View>
                        <Text>{dateToLocale(deliveryDate)}</Text>

                        <BR val={20} />
                        <View style={styles.section_header}>
                            <View style={styles.section_title}>
                                <Order order={4} validated={!!deliveryPerson} />
                                <TextMedium fontSize={FontSize.H4 - 2}>{I18n.t("shop.delivry_person")}</TextMedium>
                            </View>

                            <OutlineButton
                                title={I18n.t("shop.select")}
                                onPress={() => setMemberModalVisible(true)}
                                renderLeftIcon={<Icon name="account-plus" />}
                            />
                        </View>
                        <View style={styles.client}>
                            <TextMedium fontSize={FontSize.H4 - 2} lineHeight={FontSize.normal + 4}>
                                {deliveryPerson?.name}
                            </TextMedium>
                        </View>

                        <BR val={20} />
                        <View style={styles.section_header}>
                            <View style={styles.section_title}>
                                <Order order={5} validated={!!paymentMethod} />
                                <TextMedium fontSize={FontSize.H4 - 2}>{I18n.t("shop.payment_method")}</TextMedium>
                            </View>
                        </View>

                        <View style={styles.payments_container}>
                            <Radiobutton
                                checked={paymentMethod == PaymentMethods.CASH}
                                title={"Cash"}
                                onPress={() => setPaymentMethod(PaymentMethods.CASH)}
                            />
                            <Radiobutton
                                checked={paymentMethod == PaymentMethods.MOBILE}
                                title={"Mobile"}
                                onPress={() => setPaymentMethod(PaymentMethods.MOBILE)}
                            />
                            <Radiobutton
                                checked={paymentMethod == PaymentMethods.CARD}
                                title={I18n.t("shop.card")}
                                onPress={() => setPaymentMethod(PaymentMethods.CARD)}
                            />
                        </View>

                        <BR val={40} />
                        <View style={styles.footer}>
                            <View style={styles.footer_input}>
                                <Input
                                    value={discount + ""}
                                    onChangeText={(val) => setDiscount(val ? parseFloat(val) : 0)}
                                    placeholder={I18n.t("shop.discount")}
                                    label={I18n.t("shop.discount")}
                                    style={{ height: 60, marginRight: 5 * rem }}
                                    keyboardType="number-pad"
                                    editable={!loading}
                                />
                            </View>
                            <View style={styles.footer_input}>
                                <Input
                                    value={fees + ""}
                                    onChangeText={(val) => setFees(val ? parseFloat(val) : 0)}
                                    placeholder={I18n.t("shop.fees")}
                                    label={I18n.t("shop.fees")}
                                    keyboardType="number-pad"
                                    style={{ height: 60, marginLeft: 5 * rem }}
                                    editable={!loading}
                                />
                            </View>
                        </View>

                        {!!cart.length && (
                            <TextBold lineHeight={FontSize.H4 + 4} fontSize={FontSize.H3 - 2} mt={20 * ren}>
                                <Text lineHeight={FontSize.H3 - 2} fontSize={FontSize.H3 - 4}>
                                    {I18n.t("shop.due_to_paid")} :{" "}
                                </Text>{" "}
                                {_due} XAF
                            </TextBold>
                        )}

                        <View style={styles.btn}>
                            <Button
                                title={I18n.t("shop.save")}
                                onPress={_save}
                                disabled={_isDisabled}
                                loading={loading}
                            />
                        </View>
                    </View>
                </ScrollView>
            </Container>
            <ModalContainer visible={productModalVisible} transparent onClose={() => setProductModalVisible(false)}>
                <ProductList
                    shop={shop}
                    validate={(products) => {
                        setCart(products);
                        setProductModalVisible(false);
                    }}
                    selectedProducts={cart}
                />
            </ModalContainer>

            <ModalContainer visible={clientModalVisible} transparent onClose={() => setClientModalVisible(false)}>
                <ClientsList
                    shop={shop}
                    select={(client) => {
                        setClient(client);
                        setLocation(client.location);
                        setClientModalVisible(false);
                    }}
                />
            </ModalContainer>

            <ModalContainer visible={memberModalVisible} transparent onClose={() => setMemberModalVisible(false)}>
                <MemberList
                    shop={shop}
                    select={(member) => {
                        setDeliveryPerson(member.user);
                        setMemberModalVisible(false);
                    }}
                />
            </ModalContainer>
            <DateTimePickerModal
                isVisible={calendarVisible}
                mode="datetime"
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}
                minimumDate={new Date()}
            />

            <Loader loading={loading} />
        </Modal>
    );
};

const styles = StyleSheet.create({
    button_container: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: entireScreenWidth,
        top: 0,
        right: 0,
        zIndex: 1000,
        padding: 16 * rem,
    },
    main: {
        padding: 10 * rem,
    },
    section_header: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 10 * ren,
    },
    section_title: {
        flexDirection: "row",
        alignItems: "center",
    },
    client: {
        flexDirection: "row",
        alignItems: "flex-end",
        marginLeft: 5 * rem,
    },
    footer: {
        flexDirection: "row",
    },
    footer_input: {
        flex: 1,
    },
    btn: {
        paddingHorizontal: 30 * rem,
        marginVertical: 40 * ren,
    },
    payments_container: {
        flexDirection: "row",
        justifyContent: "space-evenly",
    },
});
