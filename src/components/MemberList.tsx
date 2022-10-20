import React, { FC, useMemo, useState } from "react";
import { StyleSheet, TouchableHighlight, View } from "react-native";
import { Colors, entireScreenWidth, filter, FontSize, rem, ren, ShopType, UserMemberType } from "@utils";
import { TextMedium } from "./TextMedium.styled";
import { Text } from "./Text.styled";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Input } from "./Input";
import { OutlineButton } from "./OutlineButton";
import I18n from "@locales";
import { useStore } from "@hooks";
import { AddMemberModal } from "./AddMemberModal";

export const MemberList: FC<{ shop: ShopType; select: (member: UserMemberType) => void }> = ({ shop, select }) => {
    const { members, loadinMembers } = useStore({ shopId: shop.id });

    const [addModalVisible, setAddModalVisible] = useState(false);
    const [searchText, setSearchText] = useState("");

    const filterMembers = useMemo(() => {
        return filter<UserMemberType>(searchText, members);
    }, [searchText]);

    const isNoData = useMemo(() => {
        return (!!searchText && !filterMembers.length) || (!searchText && !members.length);
    }, [searchText, members, filterMembers]);

    if (loadinMembers)
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
                    onPress={() => setAddModalVisible(true)}
                    renderLeftIcon={<Icon name="plus" />}
                />
            </View>
            <View style={styles.list_container}>
                {(!!searchText ? filterMembers : members).map((member, i) => {
                    return (
                        <MemberItem
                            member={member}
                            key={i}
                            select={() => {
                                select(member);
                            }}
                            shopId={shop.id}
                        />
                    );
                })}

                {isNoData && <Text>{I18n.t("shop.no_data_found")}</Text>}
            </View>

            <AddMemberModal shop={shop} visible={addModalVisible} close={() => setAddModalVisible(false)} />
        </View>
    );
};

const MemberItem: FC<{ member: UserMemberType; select: () => void; shopId?: string }> = ({
    member,
    select,
    shopId,
}) => {
    const { user } = member;
    const { userPendingDeliveries, loadingUserPendingDeliveries } = useStore({ userId: user.id, shopId });
    return (
        <TouchableHighlight style={styles.item} onPress={select} underlayColor={Colors.light_gray}>
            <View>
                <TextMedium fontSize={FontSize.normal} lineHeight={FontSize.normal + 2}>
                    {user.name}
                </TextMedium>
                <Text fontSize={FontSize.small} lineHeight={FontSize.normal} mt={5 * ren}>
                    {loadingUserPendingDeliveries ? "..." : userPendingDeliveries.length}{" "}
                    {I18n.t("shop.pending_delivery")}
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
});
