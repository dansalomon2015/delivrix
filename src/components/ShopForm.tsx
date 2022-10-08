import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import FastImage from "react-native-fast-image";
import I18n from "@locales";
import { FontSize, rem, ren, ROLES, ShopType } from "@utils";
import { Input } from "./Input";
import { TextMedium } from "./TextMedium.styled";
import { Button } from "./Button";
import { setCurrentShop, useAppSelector } from "@storage";
import { createShop, saveMembership } from "@api";
import { useDispatch } from "react-redux";

const formErrorInit = {
    nameFieldError: "",
    locationFieldError: "",
};

export const ShopForm: React.FC<{ close: () => void }> = ({ close }) => {
    const user = useAppSelector((state) => state.rootReducer.user!);
    const dispatch = useDispatch();
    const [name, setName] = useState("");
    const [location, setLocation] = useState("");
    const [error, setError] = useState(formErrorInit);

    const [loading, setLoading] = useState(false);

    const _create = () => {
        if (name.trim().length < 3) {
            return setError({ ...formErrorInit, nameFieldError: I18n.t("error.at_least", { number: 3 }) });
        }

        if (location.trim().length < 4) {
            return setError({ ...formErrorInit, locationFieldError: I18n.t("error.at_least", { number: 4 }) });
        }

        setError(formErrorInit);
        setLoading(true);

        let shop: ShopType = {
            owner: user,
            name,
            location,
            createdAt: new Date().getTime(),
        };

        createShop(shop)
            .then(async (result) => {
                shop.id = result.id;
                await saveMembership({
                    user,
                    shop,
                    roles: [ROLES.ADMIN, ROLES.OWNER, ROLES.MEMBER],
                    createdAt: new Date().getTime(),
                });
                dispatch(setCurrentShop(shop));
                close();
            })
            .catch((e) => console.log(e))
            .finally(() => setLoading(false));
    };

    return (
        <View style={styles.container}>
            <View style={styles.img_container}>
                <FastImage
                    source={require("src/assets/images/shop_img.png")}
                    resizeMode={FastImage.resizeMode.contain}
                    style={styles.image}
                />
            </View>
            <View style={{ flex: 1 }}>
                <TextMedium fontSize={FontSize.H3} textAlign="center">
                    {I18n.t("shop.new")}
                </TextMedium>
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
                    value={location}
                    onChangeText={setLocation}
                    placeholder={I18n.t("shop.location")}
                    label={I18n.t("shop.location")}
                    multiline
                    numberOfLines={4}
                    maxLength={200}
                    style={{ marginTop: 20, height: 90 }}
                    textError={error.locationFieldError}
                    editable={!loading}
                />

                <Button
                    loading={loading}
                    title={I18n.t("shop.save")}
                    style={styles.button}
                    onPress={_create}
                    disabled={loading}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        paddingHorizontal: 10 * rem,
        paddingVertical: 20 * ren,
        alignItems: "center",
    },
    image: {
        width: 100 * rem,
        height: undefined,
        aspectRatio: 1 / 1,
    },
    img_container: {
        justifyContent: "center",
        alignItems: "center",
        paddingRight: 10,
        height: "100%",
        paddingBottom: 80 * rem,
    },
    button: {
        marginVertical: 20 * ren,
        marginHorizontal: 30 * rem,
    },
});
