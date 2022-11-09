import { NativeModules } from "react-native";
import mockAsyncStorage from "@react-native-async-storage/async-storage/jest/async-storage-mock";
import mockRNLocalize from "react-native-localize/mock";
import "react-native-gesture-handler/jestSetup";
import mockRNCNetInfo from "@react-native-community/netinfo/jest/netinfo-mock";

jest.mock("@react-native-async-storage/async-storage", () => mockAsyncStorage);
jest.mock("react-native-localize", () => mockRNLocalize);
jest.mock("@react-native-google-signin/google-signin", () => {});

jest.mock("react-native/Libraries/EventEmitter/NativeEventEmitter.js", () => {
    const { EventEmitter } = require("events");
    return EventEmitter;
});

const mockedFirestoreCollection = jest.fn();
jest.mock("@react-native-firebase/firestore", () => () => {
    return {
        collection: mockedFirestoreCollection,
    };
});

jest.mock("reduxjs-toolkit-persist", () => {
    const real = jest.requireActual("eduxjs-toolkit-persist");
    return {
        ...real,
        persistReducer: jest.fn().mockImplementation((config, reducers) => reducers),
    };
});

jest.mock("redux-persist", () => {
    const real = jest.requireActual("redux-persist");
    return {
        ...real,
        persistReducer: jest.fn().mockImplementation((config, reducers) => reducers),
    };
});

jest.mock("@react-native-community/netinfo", () => mockRNCNetInfo);
// jest.mock("react-native-permissions", () => {
//     return {
//         check: () => Promise.resolve("granted"),
//         request: (permission) => Promise.resolve("granted"),
//     };
// });
jest.mock("react-native-permissions", () => require("react-native-permissions/mock"));
jest.mock("react-native-qrcode-scanner", () => jest.fn());
