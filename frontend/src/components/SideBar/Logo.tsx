import React from "react";
import styled from "styled-components";

const LogoContainer = styled.div`
  text-align: center;
  color: white;
  font-weight: 900;
`;

const Logo = () => {
  return (
    <LogoContainer>
      <h1>Team Fiance</h1>
    </LogoContainer>
  );
};

export default Logo;
