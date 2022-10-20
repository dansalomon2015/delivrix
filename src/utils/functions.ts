import numeral from "numeral";
import "numeral/locales/fr";
import "numeral/locales/en-gb";
import I18n from "@locales";
import { UserType } from "./types";

numeral.locale(I18n.language == "fr" ? "fr" : "en-gb");

export const formatAmount = (amount: number | string) => {
    let a = amount;
    if (typeof amount === "string") a = parseFloat(amount);

    return numeral(a).format("0,[00]");
};

export const _cleanString = (str: string) => {
    return str.replace(/\s/g, "");
};

interface attr {
    name?: string;
    location?: string;
    user?: UserType;
}

export const filter = <T extends attr>(searchText: string, data: T[]): T[] => {
    let filtered: T[] = [];

    if (!!searchText.trim()) {
        const regex = new RegExp(`${searchText.trim()}`, "i");
        filtered = data.filter((item) => {
            const { name, location, user } = item;
            if (name) {
                if (name.search(regex) >= 0) return item;
            }
            if (location) {
                if (location.search(regex) >= 0) return item;
            }

            if (user) {
                const { name } = user;
                if (name.search(regex) >= 0) return item;
            }
        });
    }

    return filtered;
};

const _addDigit = (digit: number) => (digit < 10 ? "0" + digit : digit);

export const getTimeFromDate = (date: Date) => {
    let hours = date.getHours();
    let minutes = date.getMinutes();

    if (I18n.language == "fr") return _addDigit(hours) + " : " + _addDigit(minutes);

    var ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    var strTime = _addDigit(hours) + " : " + _addDigit(minutes) + " " + ampm;
    return strTime;
};

export const dateToLocale = (d: string) => {
    if (!d) return null;
    var date = new Date(d);

    let locale = I18n.language === "fr" ? "fr-FR" : "en-US";
    return (
        date.toLocaleDateString(locale, { day: "2-digit" }) +
        " " +
        date.toLocaleDateString(locale, { month: "long" }) +
        " " +
        date.toLocaleDateString(locale, { year: "numeric" }) +
        "  -  " +
        getTimeFromDate(date)
    );
};

export const isToday = (date: Date | string | number) => {
    let d: number = typeof date === "object" || typeof date === "string" ? new Date(date).getTime() : date;

    let todayMidnight = new Date().setHours(0, 0, 0, 0);
    let tomorrowMidnight = new Date(todayMidnight);
    tomorrowMidnight.setDate(tomorrowMidnight.getDate() + 1);

    return todayMidnight <= d && tomorrowMidnight.getTime() >= d;
};

export const isTomorrow = (date: Date | string | number) => {
    console.log(date, isToday(date));
    let d: number = typeof date === "object" || typeof date === "string" ? new Date(date).getTime() : date;

    let _date = new Date(d);
    _date.setDate(_date.getDate() - 1);

    return isToday(_date);
};

export const isPhoneValid = (phone: string) => {
    var regex = /^\+(?:[0-9] ?){6,14}[0-9]$/;
    return !!regex.test(phone);
};
