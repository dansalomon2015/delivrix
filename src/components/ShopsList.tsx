import React, { FC, useMemo } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useStore } from "@hooks";
import { setCurrentShop, useAppSelector } from "@storage";
import { rem, UserMemberType } from "src/utils";
import { Avatar } from "./Avatar";
import { useDispatch } from "react-redux";

export const ShopsList: FC<{ horizontal?: boolean }> = ({ horizontal }) => {
    const user = useAppSelector((state) => state.rootReducer.user);
    const currentShop = useAppSelector((state) => state.rootReducer.currentShop);
    const { userShops } = useStore({ userId: user?.id });

    const getList = useMemo(() => {
        if (currentShop) {
            return userShops.filter((m) => {
                const {
                    shop: { id },
                } = m;
                if (!(id === currentShop.id)) return m;
            });
        }

        return userShops;
    }, [userShops, currentShop]);

    return <HorizontalList list={getList} />;
};

const HorizontalList: FC<{ list: UserMemberType[] }> = ({ list }) => {
    const dispatch = useDispatch();
    return (
        <View style={styles.conatainer_horizontal}>
            {list.map((member, i) => {
                const { shop } = member;
                return <Avatar item={shop} key={i} ml={10} onPress={() => dispatch(setCurrentShop(shop))} />;
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    conatainer_horizontal: {
        flexDirection: "row",
        alignItems: "center",
        padding: 10 * rem,
    },
});
