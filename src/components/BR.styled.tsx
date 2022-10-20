import { ren } from "@utils";
import styled from "styled-components/native";

interface BRProps {
    val?: number;
    bgcolor?: string;
}

export const BR = styled.View<BRProps>`
    margin-top: ${(props) => (props.val ? props.val * ren : 10 * ren)}px;
`;
