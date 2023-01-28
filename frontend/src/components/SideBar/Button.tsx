import React, { MouseEventHandler } from "react";
import styled from "styled-components";

export interface ButtonProp {
  text: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}
export const SideBarButton = styled.button`
  background-color: #133151;
  color: white;
  border: none;

  font-family: sans-serif;
  font-size: x-large;

  // hover effect
  &:hover {
    font-weight: 900;
    font-size: xx-large;
  }
`;

const Button = ({ text, onClick }: ButtonProp) => {
  return <SideBarButton onClick={onClick}>{text}</SideBarButton>;
};

export default Button;
