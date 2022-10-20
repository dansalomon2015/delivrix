import React, { FC, useMemo } from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { useStore } from "@hooks";
import { setCurrentShop, useAppSelector } from "@storage";
import { Colors, FontSize, rem, ROLES, sizes, UserMemberType } from "@utils";
import { Avatar } from "./Avatar";
import { useDispatch } from "react-redux";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { TextMedium } from "./TextMedium.styled";

export const ShopsList: FC<{ horizontal?: boolean; viewAll: () => void }> = ({ horizontal, viewAll }) => {
    const user = useAppSelector((state) => state.rootReducer.user);
    const currentShop = useAppSelector((state) => state.rootReducer.currentShop);
    const { userShops } = useStore({ userId: user?.id });

    const getList = useMemo(() => {
        if (currentShop) {
            return userShops
                .filter((m) => {
                    const {
                        shop: { id },
                    } = m;
                    if (!(id === currentShop.id)) return m;
                })
                .splice(0, 2);
        }

        return userShops.splice(0, 2);
    }, [userShops, currentShop, user]);

    return <HorizontalList list={getList} count={userShops.length} viewAll={viewAll} />;
};

const HorizontalList: FC<{ list: UserMemberType[]; count: number; viewAll: () => void }> = ({
    list,
    count,
    viewAll,
}) => {
    const dispatch = useDispatch();
    return (
        <View style={styles.conatainer_horizontal}>
            {list.map((member, i) => {
                const {
                    shop,
                    roles,
                    user: { id },
                } = member;
                const { pendingDeliveries, notAssignedDeliveries } = useStore({
                    shopId: shop.id,
                    memberUserId: roles.indexOf(ROLES.ADMIN) ? id : undefined,
                });
                let _count = pendingDeliveries.length + notAssignedDeliveries.length;
                return (
                    <View key={i}>
                        <Avatar item={shop} size="sm" ml={10} onPress={() => dispatch(setCurrentShop(shop))} />
                        {!!_count && (
                            <View
                                style={[styles.counter_container, { right: -4, top: -4, backgroundColor: Colors.dark }]}
                            >
                                <TextMedium
                                    color={Colors.white}
                                    fontSize={FontSize.tiny}
                                    lineHeight={FontSize.tiny + 2}
                                >
                                    {_count}
                                </TextMedium>
                            </View>
                        )}
                    </View>
                );
            })}
            <Pressable style={styles.button} onPress={viewAll}>
                <Icon name="chevron-right" size={14 * rem} />
                <View style={styles.counter_container}>
                    <TextMedium color={Colors.white} fontSize={FontSize.tiny} lineHeight={FontSize.tiny + 2}>
                        {count}
                    </TextMedium>
                </View>
            </Pressable>
        </View>
    );
};

const styles = StyleSheet.create({
    conatainer_horizontal: {
        flexDirection: "row",
        alignItems: "center",
    },
    button: {
        height: sizes.xs,
        width: sizes.xs,
        marginLeft: 10 * rem,
        borderRadius: 50,
        borderWidth: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    counter_container: {
        justifyContent: "center",
        alignItems: "center",
        height: 16,
        width: 16,
        borderRadius: 50,
        backgroundColor: Colors.grey,
        position: "absolute",
        top: -8,
        right: -8,
    },
});
