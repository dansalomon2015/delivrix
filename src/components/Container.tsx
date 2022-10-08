import { Colors } from "@utils";
import styled from "styled-components/native";

interface Props {
    bgcolor?: string;
    padding?: number;
}

export const Container = styled.SafeAreaView<Props>`
    flex: 1;
    background-color: ${(props) => props.bgcolor || Colors.white};
    padding: ${(props) => props.padding || 0}px;
`;
