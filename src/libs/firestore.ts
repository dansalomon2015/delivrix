import firestore from "@react-native-firebase/firestore";

export const usersCollection = firestore().collection("users");
export const productsCollection = firestore().collection("products");
export const shopsCollection = firestore().collection("shops");
export const userGroupsCollection = firestore().collection("user_groups");
export const clientsCollection = firestore().collection("clients");
export const orderssCollection = firestore().collection("orders");
