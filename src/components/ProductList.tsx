import React, { FC, useCallback, useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import { useStore } from "@hooks";
import { Colors, entireScreenWidth, filter, FontSize, formatAmount, ProductType, rem, ren, ShopType } from "@utils";
import { ProductForm } from "./ProductForm";
import { ModalContainer } from "./ModalContainer";
import { TextMedium } from "./TextMedium.styled";
import { OutlineButton } from "./OutlineButton";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import I18n from "@locales";
import { Input } from "./Input";
import { Text } from "./Text.styled";

export const ProductList: FC<{
    shop: ShopType;
    validate: (products: ProductType[]) => void;
    selectedProducts: ProductType[];
}> = ({ shop, validate, selectedProducts }) => {
    const { loadingProducts, products } = useStore({ shopId: shop.id });

    const [selected, setSelected] = useState<ProductType[]>(selectedProducts);
    const [modalFormVisible, setModalFormVisible] = useState(false);
    const [searchText, setSearchText] = useState("");

    const isSelected = useCallback(
        (product: ProductType) => {
            return !!selected.find((p) => p.id === product.id);
        },
        [selected]
    );

    const updadeSelectedList = (product: ProductType) => {
        if (isSelected(product)) {
            let filtered = selected.filter((p) => !(p.id === product.id));
            return setSelected(filtered);
        }

        setSelected([product, ...selected]);
    };

    const filterProducts = useMemo(() => {
        return filter<ProductType>(searchText, products);
    }, [searchText]);

    const isNoData = useMemo(() => {
        return (!!searchText && !filterProducts.length) || (!searchText && !products.length);
    }, [searchText, products, filterProducts]);

    if (loadingProducts)
        return (
            <View style={styles.container}>
                <Text>{I18n.t("shop.loading")}...</Text>
            </View>
        );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={{ flex: 1 }}>
                    <Input
                        value={searchText}
                        onChangeText={setSearchText}
                        placeholder={I18n.t("shop.search")}
                        style={{ height: 40 * ren }}
                    />
                </View>
            </View>
            <View style={{ flexDirection: "row", justifyContent: "flex-end", marginTop: 20, marginBottom: 15 }}>
                <OutlineButton
                    title={I18n.t("shop.add")}
                    onPress={() => setModalFormVisible(true)}
                    renderLeftIcon={<Icon name="plus" />}
                />
                <OutlineButton
                    title={I18n.t("shop.validate")}
                    onPress={() => validate(selected)}
                    style={{ backgroundColor: Colors.primary, marginLeft: 15 * rem }}
                    renderLeftIcon={<Icon name="check-all" />}
                />
            </View>
            <View style={styles.list_container}>
                {(!!searchText ? filterProducts : products).map((product, i) => (
                    <ProductItem
                        product={product}
                        key={i}
                        selected={isSelected(product)}
                        select={() => updadeSelectedList(product)}
                    />
                ))}

                {isNoData && <Text>{I18n.t("shop.no_data_found")}</Text>}
            </View>

            <ModalContainer visible={modalFormVisible} transparent onClose={() => setModalFormVisible(false)}>
                <ProductForm shop={shop} close={() => setModalFormVisible(false)} />
            </ModalContainer>
        </View>
    );
};

export const ProductItem: FC<{ product: ProductType; select: () => void; selected: boolean }> = ({
    product,
    selected,
    select,
}) => {
    const { name, price } = product;

    return (
        <View style={styles.item}>
            <View style={styles.item_name}>
                <Icon
                    name={selected ? "checkbox-marked" : "checkbox-blank-outline"}
                    color={selected ? Colors.primary : Colors.dark}
                    size={24 * rem}
                    onPress={select}
                />
                <TextMedium fontSize={FontSize.H4 + 1} ml={10} numberOfLines={1}>
                    {name}
                </TextMedium>
            </View>
            <Text fontSize={FontSize.H4 - 1}>{formatAmount(price)} XAF</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white,
        width: entireScreenWidth,
        padding: 10 * rem,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    list_container: {
        borderTopColor: Colors.grey,
        borderBottomWidth: 0.5,
    },
    item: {
        flexDirection: "row",
        justifyContent: "space-between",
        borderTopWidth: 0.5,
        borderTopColor: Colors.grey,
        paddingVertical: 10 * ren,
    },
    item_name: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
    },
});
