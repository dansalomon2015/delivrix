import mockAsyncStorage from "@react-native-async-storage/async-storage/jest/async-storage-mock";
import mockRNLocalize from "react-native-localize/mock";
import "react-native-gesture-handler/jestSetup";

jest.mock("@react-native-async-storage/async-storage", () => mockAsyncStorage);
jest.mock("react-native-localize", () => mockRNLocalize);

jest.mock("redux-persist", () => {
    const real = jest.requireActual("redux-persist");
    return {
        ...real,
        persistReducer: jest.fn().mockImplementation((config, reducers) => reducers),
    };
});
