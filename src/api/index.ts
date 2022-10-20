import {
    ClientType,
    OrderType,
    ProductType,
    ShopType,
    UserMemberType,
    USERS_COLLLECTION_LABEL,
    UserType,
} from "@utils";
import firestore from "@react-native-firebase/firestore";

const usersCollection = firestore().collection(USERS_COLLLECTION_LABEL);
const shopsCollection = firestore().collection("shops");
const membersCollection = firestore().collection("members");
const productsCollection = firestore().collection("products");
const clientsCollection = firestore().collection("clients");
const ordersCollection = firestore().collection("orders");

export const getUserbyId = (userId: string) => {
    return usersCollection.doc(userId).get();
};

export const updateUser = (user: UserType) => {
    return usersCollection.doc(user.id).set(user);
};

export const createShop = (shop: ShopType) => {
    return shopsCollection.add(shop);
};

export const saveMembership = (member: UserMemberType) => {
    return membersCollection.add(member);
};

export const updateMembership = (member: UserMemberType) => {
    const { id } = member;
    return membersCollection.doc(id).set(member);
};

export const addOrUpdateProduct = (product: ProductType) => {
    const { id } = product;
    if (id) return productsCollection.doc(id).set(product);

    return productsCollection.add(product);
};

export const addOrUpdateClient = (client: ClientType) => {
    const { id } = client;
    if (id) return clientsCollection.doc(id).set(client);

    return clientsCollection.add(client);
};

export const addOrUpdateOrder = (order: OrderType) => {
    const { id } = order;
    if (id) return ordersCollection.doc(id).set(order);

    return ordersCollection.add(order);
};

export const getMembersCollection = () => {
    return membersCollection;
};

export const getProdutsCollection = () => {
    return productsCollection;
};

export const getClientsCollection = () => {
    return clientsCollection;
};

export const getOrdersCollection = () => {
    return ordersCollection;
};
