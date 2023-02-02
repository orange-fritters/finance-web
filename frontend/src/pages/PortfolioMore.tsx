import React from "react";
import styled from "styled-components";
import MoreContents from "../components/Portfolio/MoreContents";
import SideBar from "../components/SideBar/SideBar";

const Container = styled.div`
  display: flex;
  flex-direction: row;
`;

const PortfolioMore = () => {
  return (
    <Container>
      <SideBar />
      <MoreContents />
    </Container>
  );
};

export default PortfolioMore;
