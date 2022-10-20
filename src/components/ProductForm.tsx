import React, { FC, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import I18n from "@locales";
import { Input } from "./Input";
import { Colors, entireScreenWidth, FontSize, ProductType, rem, ren, ShopType } from "@utils";
import { Button } from "./Button";
import { TextMedium } from "./TextMedium.styled";
import { addOrUpdateProduct } from "src/api";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Toast from "react-native-toast-message";

const formErrorInit = {
    nameFieldError: "",
    priceFieldError: "",
};

export const ProductForm: FC<{ shop: ShopType; product?: ProductType; close: () => void }> = ({
    product,
    close,
    shop,
}) => {
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState("");
    const [price, setPrice] = useState(0);
    const [error, setError] = useState(formErrorInit);

    useEffect(() => {
        if (product) {
            const { name, price } = product;
            setName(name);
            setPrice(price);
        }
    }, [product]);

    const _create = () => {
        if (name.trim().length < 3) {
            return setError({ ...formErrorInit, nameFieldError: I18n.t("error.at_least", { number: 3 }) });
        }

        if (price <= 0) {
            return setError({ ...formErrorInit, priceFieldError: I18n.t("error.invalid_amount") });
        }

        setError(formErrorInit);
        setLoading(true);

        let _product: ProductType = {
            ...product,
            name,
            price,
            createdAt: product?.createdAt || new Date().getTime(),
            quantity: 1,
            shopId: shop.id!,
        };

        addOrUpdateProduct(_product)
            .then(async (result) => {
                Toast.show({
                    type: "success",
                    text1: I18n.t("dialog.success"),
                });
                close();
            })
            .catch((e) => {
                console.log(e);
                Toast.show({
                    type: "error",
                    text1: I18n.t("dialog.failed"),
                });
                setLoading(false);
            });
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TextMedium fontSize={FontSize.H4 + 4}>{I18n.t("shop.new")}</TextMedium>
                <Icon size={24 * rem} name="close-circle" onPress={close} color={Colors.dark} />
            </View>
            <Input
                value={name}
                onChangeText={setName}
                placeholder={I18n.t("shop.name")}
                label={I18n.t("shop.name")}
                style={{ marginTop: 20 }}
                textError={error.nameFieldError}
                editable={!loading}
            />
            <Input
                value={price + ""}
                onChangeText={(val) => setPrice(val ? parseFloat(val) : 0)}
                placeholder={I18n.t("shop.price")}
                label={I18n.t("shop.price")}
                style={{ marginTop: 20 }}
                textError={error.priceFieldError}
                editable={!loading}
                keyboardType="number-pad"
            />

            <Button
                loading={loading}
                title={I18n.t("shop.save")}
                style={styles.button}
                onPress={_create}
                disabled={loading}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: entireScreenWidth * 0.85,
        backgroundColor: Colors.white,
        borderRadius: 10,
        padding: 16 * rem,
    },
    button: {
        marginVertical: 20 * ren,
        marginHorizontal: 30 * rem,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
});
