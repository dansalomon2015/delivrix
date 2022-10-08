import { useEffect, useState } from "react";
import { getMembersCollection } from "@api";
import { ROLES, UserMemberType } from "@utils";

interface Props {
    shopId?: string;
    userId?: string;
}

export const useStore = ({ shopId, userId }: Props) => {
    const [members, setMembers] = useState<UserMemberType[]>([]);
    const [canAddMember, setCanAddMember] = useState(false);
    // List of shops where user is a member
    const [userShops, setUserShops] = useState<UserMemberType[]>([]);

    useEffect(() => {
        if (userId) {
            const membersListener = getMembersCollection()
                .where("user.id", "==", userId)
                .onSnapshot((result) => {
                    let list: UserMemberType[] = [];
                    result.forEach((document) => {
                        list.push(document.data() as UserMemberType);
                    });

                    setUserShops(list);
                });

            return () => {
                membersListener();
            };
        }
    }, [userId]);

    useEffect(() => {
        if (shopId) {
            const membersListener = getMembersCollection()
                .where("shop.id", "==", shopId)
                .onSnapshot((result) => {
                    let list: UserMemberType[] = [];
                    result.forEach((document) => {
                        list.push(document.data() as UserMemberType);
                    });

                    setMembers(list);
                });

            return () => {
                membersListener();
            };
        }
    }, [shopId]);

    useEffect(() => {
        if (shopId && userId) {
            setCanAddMember(false);
            const membersListener = getMembersCollection()
                .where("shop.id", "==", shopId)
                .where("user.id", "==", userId)
                .where("roles", "array-contains", ROLES.ADMIN)
                .onSnapshot((result) => {
                    let list: UserMemberType[] = [];
                    result.forEach((document) => {
                        list.push(document.data() as UserMemberType);
                    });

                    setCanAddMember(!!list.length);
                });

            return () => {
                membersListener();
            };
        }
    }, [shopId, userId]);

    return {
        members,
        canAddMember,
        userShops,
    };
};
