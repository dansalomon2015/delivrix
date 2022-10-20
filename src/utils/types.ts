export enum ROLES {
    MEMBER = "MEMBER",
    ADMIN = "ADMIN",
    OWNER = "OWNER",
}

export enum ORDER_STATUS {
    INIT = "INIT",
    ASSIGNED = "ASSIGNED",
    DELIVERED = "DELIVERED",
    CANCELED = "CANCELED",
}

export type RootStateType = {
    firstLaunch: boolean;
    user?: UserType;
    currentShop?: ShopType;
};

export type UserType = {
    id: string;
    email: string;
    name: string;
    photo?: string;
    updatedAt: number;
    createdAt: number;
};

export type ShopType = {
    id?: string;
    name: string;
    location: string;
    owner: UserType;
    photo?: string;
    createdAt: number;
};

export type UserMemberType = {
    id?: string;
    user: UserType;
    shop: ShopType;
    roles: ROLES[];
    createdAt: number;
};

export type ProductType = {
    id?: string;
    name: string;
    price: number;
    quantity: number;
    shopId: string;
    createdAt: number;
};

export type ClientType = {
    id?: string;
    name: string;
    location: string;
    phone: string;
    shopId: string;
    createdAt: number;
};

export enum PaymentMethods {
    CASH = "CASH",
    MOBILE = "MOBILE",
    CARD = "CARD",
}

export type OrderType = {
    id?: string;
    products: ProductType[];
    client: ClientType;
    location: string;
    assignedTo: UserType | null;
    shop: ShopType;
    status: ORDER_STATUS;
    paymentMethod: PaymentMethods;
    toPaid: number;
    deliveryDate: number;
    deliveryFee: number;
    createdBy: UserType;
    createdAt: number;
};

export type SizeType = "xs" | "sm" | "md" | "lg";
