import React, { FC } from "react";
import Dialog from "react-native-dialog";
import { Colors } from "@utils";

interface Props {
    title?: string;
    message: string;
    cancelText?: string;
    acceptText?: string;
    onCancel?: () => void;
    onAccept?: () => void;
    visible?: boolean;
}

export const DialogBox: FC<Props> = ({ visible, title, message, cancelText, acceptText, onAccept, onCancel }) => {
    return (
        <Dialog.Container visible={visible} contentStyle={{ backgroundColor: Colors.white }}>
            {!!title && <Dialog.Title style={{ color: Colors.dark }}>{title}</Dialog.Title>}
            <Dialog.Description>{message}</Dialog.Description>
            {!!onCancel && <Dialog.Button style={{ color: Colors.red }} label={cancelText} onPress={onCancel} />}
            {!!onAccept && (
                <Dialog.Button style={{ color: Colors.grey }} label={acceptText || "Ok"} onPress={onAccept} />
            )}
        </Dialog.Container>
    );
};
