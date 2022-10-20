import React, { FC, useMemo, useState } from "react";
import { StyleSheet, TouchableHighlight, View } from "react-native";
import { ShopType, ClientType, filter, Colors, entireScreenWidth, rem, ren, FontSize } from "@utils";
import { useStore } from "src/hooks";
import { Input } from "./Input";
import I18n from "@locales";
import { ModalContainer } from "./ModalContainer";
import { ClientForm } from "./ClientForm";
import { OutlineButton } from "./OutlineButton";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { TextMedium } from "./TextMedium.styled";
import { Text } from "./Text.styled";

export const ClientsList: FC<{
    shop: ShopType;
    select: (client: ClientType) => void;
}> = ({ shop, select }) => {
    const { clients, loadingClients } = useStore({ shopId: shop.id });

    const [modalFormVisible, setModalFormVisible] = useState(false);
    const [searchText, setSearchText] = useState("");

    const filterClients = useMemo(() => {
        return filter<ClientType>(searchText, clients);
    }, [searchText]);

    const isNoData = useMemo(() => {
        return (!!searchText && !filterClients.length) || (!searchText && !clients.length);
    }, [searchText, clients, filterClients]);

    if (loadingClients)
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
            </View>
            <View style={styles.list_container}>
                {(!!searchText ? filterClients : clients).map((client) => {
                    const { id } = client;
                    return (
                        <ClientItem
                            client={client}
                            key={id}
                            select={() => {
                                select(client);
                            }}
                        />
                    );
                })}

                {isNoData && <Text>{I18n.t("shop.no_data_found")}</Text>}
            </View>

            <ModalContainer visible={modalFormVisible} transparent onClose={() => setModalFormVisible(false)}>
                <ClientForm shop={shop} close={() => setModalFormVisible(false)} />
            </ModalContainer>
        </View>
    );
};

const ClientItem: FC<{ client: ClientType; select: () => void }> = ({ client, select }) => {
    return (
        <TouchableHighlight style={styles.item} onPress={select} underlayColor={Colors.light_gray}>
            <View>
                <View style={styles.head}>
                    <TextMedium fontSize={FontSize.normal} lineHeight={FontSize.normal + 2}>
                        {client.name}
                    </TextMedium>
                    <Text fontSize={FontSize.small} lineHeight={FontSize.small + 4}>
                        {client.phone}
                    </Text>
                </View>
                <Text fontSize={FontSize.small} lineHeight={FontSize.normal} mt={5 * ren}>
                    {client.location}
                </Text>
            </View>
        </TouchableHighlight>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white,
        width: entireScreenWidth,
        padding: 10 * rem,
    },
    list_container: {
        borderBottomWidth: 0.5,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    item: {
        borderTopWidth: 0.5,
        paddingVertical: 10 * ren,
    },
    head: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
});
