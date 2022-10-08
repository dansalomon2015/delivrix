import { useEffect, useState } from "react";
import NetInfo from "@react-native-community/netinfo";

export const useOnlineHook = () => {
    const [online, setOnline] = useState(false);

    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener((state) => {
            setOnline(!!state.isInternetReachable);
        });

        return () => {
            unsubscribe();
        };
    }, []);

    return online;
};
