import { ShopType, UserMemberType, USERS_COLLLECTION_LABEL, UserType } from "@utils";
import firestore from "@react-native-firebase/firestore";

const usersCollection = firestore().collection(USERS_COLLLECTION_LABEL);
const shopsCollection = firestore().collection("shops");
const membersCollection = firestore().collection("members");

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

export const getMembersCollection = () => {
    return membersCollection;
};
