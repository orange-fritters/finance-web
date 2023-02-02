import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const LogoContainer = styled.div`
  text-align: center;
  color: white;
  font-weight: 900;
  // hover effect
  &:hover {
    cursor: pointer;
  }
`;

const Logo = () => {
  const nav = useNavigate();
  return (
    <LogoContainer onClick={() => nav("/")}>
      <h1>Team Fiance</h1>
    </LogoContainer>
  );
};

export default Logo;
