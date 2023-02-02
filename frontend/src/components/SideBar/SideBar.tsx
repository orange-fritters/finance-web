import React from "react";
import styled from "styled-components";
import Logo from "./Logo";
import Button from "./Button";
import { useNavigate } from "react-router-dom";

const SideBarContainer = styled.div`
  display: grid;
  grid-template-rows: 1fr 2.5fr 2.5fr 1fr;
  grid-template-columns: 1fr;

  background-color: #133151;

  min-width: 200px;
  width: 15%;
  height: 100vh;
`;

const LogoContainer = styled.div`
  color: white;

  display: flex;
  justify-content: center;
  align-items: center;
`;

const ButtonContainer = styled.div`
  color: white;

  display: flex;
  flex-direction: column;
  gap: 10%;
  justify-content: center;
  align-items: center;
`;

const BrandContainer = styled.div`
  color: white;

  display: flex;
  justify-content: center;
  // put item from bottom
  align-items: flex-end;
  padding-bottom: 20%;
`;

const SideBar = () => {
  const navigate = useNavigate();

  return (
    <SideBarContainer>
      <LogoContainer>
        <Logo />
      </LogoContainer>
      <ButtonContainer>
        <Button
          text="Home"
          onClick={() => {
            navigate("/");
          }}
        />
        <Button text="About" />
        <Button text="Contact" />
      </ButtonContainer>
      <ButtonContainer>
        <Button
          text="Portfolio"
          onClick={() => {
            navigate("/portfolio");
          }}
        />
        <Button
          text="Sentiment"
          onClick={() => {
            navigate("/sentiment");
          }}
        />
        <Button
          text="Prediction"
          onClick={() => {
            navigate("/prediction");
          }}
        />
      </ButtonContainer>
      <BrandContainer>Bitamin Conference</BrandContainer>
    </SideBarContainer>
  );
};

export default SideBar;
