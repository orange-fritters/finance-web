import React from "react";
import styled from "styled-components";
import Contents from "../components/Portfolio/Contents";
import SideBar from "../components/SideBar/SideBar";

const Container = styled.div`
  display: flex;
  flex-direction: row;
`;

const Portfolio = () => {
  return (
    <Container>
      <SideBar />
      <Contents />
    </Container>
  );
};

export default Portfolio;
