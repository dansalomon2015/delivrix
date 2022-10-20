import React, { FC, useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Colors, FontSize, rem, ren, ShopType, SizeType } from "@utils";
import { Avatar } from "./Avatar";
import { TextMedium } from "./TextMedium.styled";
import { useAppSelector } from "@storage";
import { Text } from "./Text.styled";
import I18n from "@locales";
import { useStore } from "@hooks";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { OutlineButton } from "./OutlineButton";
import { AddMemberModal } from "./AddMemberModal";

interface Props {
    shop: ShopType;
    size?: SizeType;
}

export const ShopItem: FC<Props> = ({ shop, size }) => {
    const user = useAppSelector((state) => state.rootReducer.user);
    const { members, isAdmin } = useStore({ shopId: shop.id, userId: user?.id });

    const [addModalVisible, setAddModalVisible] = useState(false);

    if (!shop) return null;

    const isOwner = useMemo(() => {
        const {
            owner: { id },
        } = shop;
        return id === user?.id;
    }, [shop, user]);

    const { name } = shop;
    return (
        <View style={styles.container}>
            <View style={{ flex: 1, flexDirection: "row" }}>
                <Avatar item={shop} size={size} />
                <View style={styles.details}>
                    <TextMedium
                        numberOfLines={2}
                        fontSize={FontSize.H4 - 2}
                        lineHeight={FontSize.H4 + 4}
                        color={Colors.grey}
                    >
                        {name}
                    </TextMedium>
                    {isOwner && (
                        <Text lineHeight={FontSize.H5 + 4} fontSize={FontSize.H5 + 2}>
                            ({I18n.t("shop.owner")})
                        </Text>
                    )}
                    <View style={styles.footer}>
                        <View style={styles.memberList}>
                            {members.map((member, i) => {
                                const { user } = member;
                                return <Avatar item={user} size="xs" key={i} ml={i === 0 ? 0 : -5} />;
                            })}
                        </View>
                        {isAdmin && (
                            <OutlineButton
                                title={I18n.t("shop.add")}
                                renderLeftIcon={
                                    <Icon name="account-multiple-plus-outline" color={Colors.dark} size={14 * rem} />
                                }
                                onPress={() => setAddModalVisible(true)}
                                style={{ marginLeft: 10 * rem }}
                            />
                        )}
                    </View>
                </View>
            </View>
            <View>
                <Icon name="information" color={Colors.grey} size={24 * rem} />
            </View>

            <AddMemberModal shop={shop} visible={addModalVisible} close={() => setAddModalVisible(false)} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
    },
    details: {
        paddingHorizontal: 10 * rem,
        flex: 1,
    },
    memberList: {
        flexDirection: "row",
        alignItems: "center",
    },
    footer: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 5 * ren,
    },
});
