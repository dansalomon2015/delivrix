import { useEffect, useState } from "react";
import { getClientsCollection, getMembersCollection, getOrdersCollection, getProdutsCollection } from "@api";
import { ClientType, OrderType, ORDER_STATUS, ProductType, ROLES, UserMemberType } from "@utils";
import { setCurrentShop, useAppSelector } from "@storage";
import { useDispatch } from "react-redux";

interface Props {
    shopId?: string;
    userId?: string;
    memberUserId?: string;
}

export const useStore = ({ shopId, userId, memberUserId }: Props) => {
    const currentShop = useAppSelector((state) => state.rootReducer.currentShop);
    const dispatch = useDispatch();
    const [members, setMembers] = useState<UserMemberType[]>([]);
    const [loadinMembers, setLoadingMembers] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    // List of shops where user is a member
    const [userShops, setUserShops] = useState<UserMemberType[]>([]);
    const [loadingShops, setLoading] = useState(true);

    const [products, setProducts] = useState<ProductType[]>([]);
    const [loadingProducts, setLoadingProducts] = useState(true);

    const [loadingClients, setLoadingClients] = useState(true);
    const [clients, setClients] = useState<ClientType[]>([]);

    const [loadingUserPendingDeliveries, setLoadingUserPendingDeliveries] = useState(true);
    const [userPendingDeliveries, setUserPendingDeliveries] = useState<OrderType[]>([]);

    const [pendingDeliveries, setPendingDeliveries] = useState<OrderType[]>([]);
    const [notAssignedDeliveries, setNotAssignedDeliveries] = useState<OrderType[]>([]);

    useEffect(() => {
        if (userId) {
            setLoading(true);
            const membersListener = getMembersCollection()
                .where("user.id", "==", userId)
                .onSnapshot((result) => {
                    let list: UserMemberType[] = [];
                    result.forEach((document) => {
                        list.push({ ...document.data(), id: document.id } as UserMemberType);
                    });

                    if (!currentShop && !!list.length) {
                        dispatch(setCurrentShop(list[0].shop));
                    }

                    setLoading(false);
                    setUserShops(list);
                });

            return () => {
                membersListener();
            };
        }
    }, [userId]);

    useEffect(() => {
        if (shopId && memberUserId) {
            const pendingDeliveriesListener = getOrdersCollection()
                .where("shop.id", "==", shopId)
                .where("assignedTo.id", "==", memberUserId)
                .where("status", "==", ORDER_STATUS.ASSIGNED)
                .onSnapshot((result) => {
                    let list: OrderType[] = [];
                    result.forEach((document) => {
                        list.push({ ...document.data(), id: document.id } as OrderType);
                    });

                    setPendingDeliveries(list);
                });

            return () => {
                pendingDeliveriesListener();
            };
        }
    }, [shopId, memberUserId]);

    useEffect(() => {
        if (shopId && !memberUserId) {
            const pendingDeliveriesListener = getOrdersCollection()
                .where("shop.id", "==", shopId)
                .where("status", "==", ORDER_STATUS.ASSIGNED)
                .onSnapshot((result) => {
                    let list: OrderType[] = [];
                    result.forEach((document) => {
                        list.push({ ...document.data(), id: document.id } as OrderType);
                    });

                    setPendingDeliveries(list);
                });

            const notAssignedDeliveriesListener = getOrdersCollection()
                .where("shop.id", "==", shopId)
                .where("status", "==", ORDER_STATUS.INIT)
                .onSnapshot((result) => {
                    let list: OrderType[] = [];
                    result.forEach((document) => {
                        list.push({ ...document.data(), id: document.id } as OrderType);
                    });

                    setNotAssignedDeliveries(list);
                });

            return () => {
                pendingDeliveriesListener();
                notAssignedDeliveriesListener();
            };
        } else {
            setNotAssignedDeliveries([]);
            setPendingDeliveries([]);
        }
    }, [shopId, memberUserId]);

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
                    setLoadingMembers(false);
                });

            const productsListner = getProdutsCollection()
                .where("shopId", "==", shopId)
                .onSnapshot((result) => {
                    let list: ProductType[] = [];
                    result.forEach((document) => {
                        list.push({ ...document.data(), id: document.id } as ProductType);
                    });

                    setProducts(list);
                    setLoadingProducts(false);
                });

            const clientsListner = getClientsCollection()
                .where("shopId", "==", shopId)
                .onSnapshot((result) => {
                    let list: ClientType[] = [];
                    result.forEach((document) => {
                        list.push({ ...document.data(), id: document.id } as ClientType);
                    });

                    setClients(list);
                    setLoadingClients(false);
                });

            return () => {
                membersListener();
                productsListner();
                clientsListner();
            };
        }
    }, [shopId]);

    useEffect(() => {
        if (shopId && userId) {
            setIsAdmin(false);
            setLoadingUserPendingDeliveries(true);
            const membersListener = getMembersCollection()
                .where("shop.id", "==", shopId)
                .where("user.id", "==", userId)
                .where("roles", "array-contains", ROLES.ADMIN)
                .onSnapshot((result) => {
                    let list: UserMemberType[] = [];
                    result.forEach((document) => {
                        list.push({ ...document.data(), id: document.id } as UserMemberType);
                    });

                    setIsAdmin(!!list.length);
                });

            const ordersListener = getOrdersCollection()
                .where("shop.id", "==", shopId)
                .where("assignedTo.id", "==", userId)
                .where("status", "==", ORDER_STATUS.ASSIGNED)
                .onSnapshot((result) => {
                    let list: OrderType[] = [];
                    result.forEach((document) => {
                        list.push({ ...document.data(), id: document.id } as OrderType);
                    });

                    setUserPendingDeliveries(list);
                    setLoadingUserPendingDeliveries(false);
                });

            return () => {
                membersListener();
                ordersListener();
            };
        }
    }, [shopId, userId]);

    useEffect(() => {
        if (shopId) {
            const productsListner = getProdutsCollection()
                .where("shopId", "==", shopId)
                .onSnapshot((result) => {
                    let list: ProductType[] = [];
                    result.forEach((document) => {
                        list.push({ ...document.data(), id: document.id } as ProductType);
                    });

                    setProducts(list);
                    setLoadingProducts(false);
                });

            return () => {
                productsListner();
            };
        }
    }, [shopId]);

    return {
        members,
        isAdmin,
        userShops,
        loadingShops,
        loadingProducts,
        products,
        loadingClients,
        clients,
        loadinMembers,
        loadingUserPendingDeliveries,
        userPendingDeliveries,
        pendingDeliveries,
        notAssignedDeliveries,
    };
};
