import { Dimensions } from "react-native";

export const entireScreenWidth = Dimensions.get("window").width;
export const entireScreenHeight = Dimensions.get("window").height;

export const rem = entireScreenWidth / 360 < 1.5 ? entireScreenWidth / 360 : 1.5;
export const ren = entireScreenHeight / 640 < 1.5 ? entireScreenHeight / 640 : 1.5;

export const IPHONE12_H = 844;
export const IPHONE12_Max = 926;
export const IPHONE12_Mini = 780;

export const sizes = {
    xs: 20 * rem,
    sm: 30 * rem,
    md: 40 * rem,
    lg: 60 * rem,
};

export const USERS_COLLLECTION_LABEL = "users";

export const DELIVERY_ITEM_WIDTH = entireScreenWidth * 0.75;
