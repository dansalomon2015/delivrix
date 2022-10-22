import React from "react";
import { SafeAreaView, StatusBar } from "react-native";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { Colors } from "@utils";
import Router from "@navigation";
import { persistor, store } from "@storage";
import Toast from "react-native-toast-message";
import codePush from "react-native-code-push";

const App = () => {
    return (
        <SafeAreaView style={{ backgroundColor: Colors.white, flex: 1 }}>
            <StatusBar barStyle={"dark-content"} backgroundColor={Colors.white} />
            <Provider store={store}>
                <PersistGate loading={null} persistor={persistor}>
                    <Router />
                </PersistGate>
            </Provider>
            <Toast />
        </SafeAreaView>
    );
};

export default codePush(App);
