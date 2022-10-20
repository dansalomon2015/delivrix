import React, { FC, useState } from "react";
import { Alert, Linking, Platform, StyleSheet, View } from "react-native";
import {
    ClientType,
    Colors,
    entireScreenWidth,
    FontSize,
    isPhoneValid,
    rem,
    ren,
    ShopType,
    _cleanString,
} from "@utils";
import { TextMedium } from "./TextMedium.styled";
import { Input } from "./Input";
import I18n from "@locales";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Button } from "./Button";
import { addOrUpdateClient } from "@api";
import { OutlineButton } from "./OutlineButton";
import { selectContactPhone } from "react-native-select-contact";
import { request, PERMISSIONS } from "react-native-permissions";

const formErrorInit = {
    nameFieldError: "",
    phoneFieldError: "",
    locationFieldError: "",
};

export const ClientForm: FC<{ shop: ShopType; close: () => void; client?: ClientType }> = ({ client, shop, close }) => {
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [location, setLocation] = useState("");
    const [error, setError] = useState(formErrorInit);

    const readContact = async () => {
        const selection = await selectContactPhone();
        if (!selection) {
            return null;
        }

        let { contact, selectedPhone } = selection;
        setName(contact.name);
        setPhone(_cleanString(selectedPhone.number));
    };

    const getPhoneNumber = async () => {
        if (Platform.OS == "android") {
            await request(PERMISSIONS.ANDROID.READ_CONTACTS).then(async (result) => {
                if (result == "blocked") {
                    return Alert.alert(
                        "Permission",
                        I18n.t("dialog.permission"),
                        [
                            { text: I18n.t("dialog.edit_settings"), onPress: () => Linking.openSettings() },
                            { text: I18n.t("dialog.deny"), style: "destructive" },
                        ],
                        {
                            cancelable: false,
                        }
                    );
                }

                if (result !== "granted") return;

                readContact();
            });
        } else {
            readContact();
        }
    };

    const _create = () => {
        if (name.trim().length < 3) {
            return setError({ ...formErrorInit, nameFieldError: I18n.t("error.at_least", { number: 3 }) });
        }

        if (!isPhoneValid(phone)) {
            return setError({ ...formErrorInit, phoneFieldError: I18n.t("error.invalid_phone_format") });
        }

        if (location.trim().length < 4) {
            return setError({ ...formErrorInit, locationFieldError: I18n.t("error.at_least", { number: 4 }) });
        }

        setError(formErrorInit);
        setLoading(true);

        let _client: ClientType = {
            ...client,
            name,
            location,
            phone: _cleanString(phone),
            shopId: shop.id!,
            createdAt: client?.createdAt || new Date().getTime(),
        };

        addOrUpdateClient(_client)
            .then(async (result) => {
                close();
            })
            .catch((e) => {
                console.log(e);
                setLoading(false);
            });
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TextMedium fontSize={FontSize.H4 + 4}>
                    {I18n.t("shop.new_", { element: I18n.t("shop.client") })}
                </TextMedium>
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
                value={phone}
                onChangeText={setPhone}
                placeholder={I18n.t("shop.phone")}
                label={`${I18n.t("shop.phone")} (${I18n.t("shop.exple")}) : +237XXX.XX`}
                style={{ marginTop: 20 }}
                textError={error.phoneFieldError}
                editable={!loading}
                keyboardType="number-pad"
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

            <View style={styles.footer}>
                <OutlineButton
                    title={I18n.t("shop.pick_from_phonebook")}
                    renderLeftIcon={<Icon name="contacts-outline" color={Colors.dark} size={18 * rem} />}
                    onPress={getPhoneNumber}
                    style={{ paddingVertical: 5 }}
                />
            </View>
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
    footer: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 15 * ren,
    },
});
