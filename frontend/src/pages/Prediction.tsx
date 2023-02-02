import React from "react";
import styled from "styled-components";
import SideBar from "../components/SideBar/SideBar";
import Contents from "../components/Prediction/PredContents";

const Container = styled.div`
  display: flex;
  flex-direction: row;
`;

const Prediction = () => {
  return (
    <Container>
      <SideBar />
      <Contents />
    </Container>
  );
};

export default Prediction;
