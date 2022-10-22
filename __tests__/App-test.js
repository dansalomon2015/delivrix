import "react-native";
import React from "react";
import App from "../App";

// Note: test renderer must be required after react-native.
import renderer from "react-test-renderer";

import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "@storage";
import { Welcome } from "@screens";

it("renders correctly", () => {
    renderer.create(
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <Welcome />
            </PersistGate>
        </Provider>
    );
});
