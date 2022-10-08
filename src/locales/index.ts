import en from "./en";
import fr from "./fr";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { getLocales } from "react-native-localize";

i18n.use(initReactI18next).init({
    compatibilityJSON: "v3",
    lng: getLocales()[0].languageCode,
    fallbackLng: "en",
    resources: {
        en: {
            translation: en,
        },
        fr: {
            translation: fr,
        },
    },
});

export default i18n;
