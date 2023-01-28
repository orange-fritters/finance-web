import React from "react";
import styled from "styled-components";

export interface ContainerProp {
  type: "big" | "small";
  loc: "left" | "right" | "none";
  children: React.ReactNode;
}

export const ContainerComponentContainer = styled.div<{
  type: string;
  loc: string;
}>`
  grid-column: ${(props) => (props.type === "big" ? "1 / 3" : "span 1")};
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  grid-template-rows: minmax(0, 1fr);

  margin: ${(props) =>
    props.loc === "none"
      ? "4% 8% 2% 8%"
      : props.loc === "left"
      ? "4% 4% 8% 16%"
      : "4% 16% 8% 4%"};
  background-color: white;
  border-radius: 10px;
`;

const ContainerComponent = ({ type, loc, children }: ContainerProp) => {
  return (
    <ContainerComponentContainer type={type} loc={loc}>
      {children}
    </ContainerComponentContainer>
  );
};

export default ContainerComponent;
