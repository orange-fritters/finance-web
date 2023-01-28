import React from "react";
import styled from "styled-components";
import Contents from "../components/Contents/Contents";
import SideBar from "../components/SideBar/SideBar";

const HomeContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

const Home = () => {
  return (
    <HomeContainer>
      <SideBar />
      <Contents />
    </HomeContainer>
  );
};

export default Home;
