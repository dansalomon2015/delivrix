import React, { FC, useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { Colors, FontSize, formatAmount, ProductType, rem, ren } from "@utils";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { TextMedium } from "./TextMedium.styled";
import { Text } from "./Text.styled";
import { TextBold } from "./TextBold.styled";
import I18n from "@locales";

interface Props {
    products: ProductType[];
    increment: (productId: string) => void;
    decrement: (productId: string) => void;
    onDelete: (productId: string) => void;
}

export const Cart: FC<Props> = ({ products, increment, decrement, onDelete }) => {
    if (!products.length) return <Text ml={5}>{I18n.t("shop.empty_list")}</Text>;

    return (
        <>
            {products.map((product) => {
                const { id } = product;
                return (
                    <Product
                        key={id}
                        product={product}
                        increment={() => increment(id!)}
                        decrement={() => decrement(id!)}
                        onDelete={() => onDelete(id!)}
                    />
                );
            })}
        </>
    );
};

const Product: FC<{ product: ProductType; increment: () => void; decrement: () => void; onDelete: () => void }> = ({
    product,
    increment,
    decrement,
    onDelete,
}) => {
    const { name, price, quantity } = product;

    const canDecrement = useMemo(() => {
        return quantity > 1;
    }, [quantity]);

    return (
        <View style={styles.container}>
            <View style={styles.item_name}>
                <Icon name="trash-can-outline" color={Colors.red} size={16 * rem} onPress={onDelete} />
                <TextMedium numberOfLines={1} ml={10} fontSize={FontSize.H4}>
                    {name}
                </TextMedium>
            </View>
            <Text ml={10} mr={20}>
                {formatAmount(price)} XAF
            </Text>
            <View style={styles.actions_container}>
                <Icon
                    name="minus-circle"
                    size={22 * rem}
                    color={canDecrement ? Colors.primary : Colors.light_gray}
                    onPress={canDecrement ? decrement : undefined}
                />
                <TextBold fontSize={FontSize.H4}>{quantity}</TextBold>
                <Icon name="plus-circle" size={22 * rem} color={Colors.primary} onPress={increment} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginVertical: 5 * ren,
    },
    item_name: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
    },
    actions_container: {
        flexDirection: "row",
        alignItems: "center",
        width: 80 * rem,
        justifyContent: "space-between",
    },
});
