import React from "react";
import styled from "styled-components";
import SideBar from "../components/SideBar/SideBar";
import Contents from "../components/Sentiment/SentimentContents";

const Container = styled.div`
  display: flex;
  flex-direction: row;
`;

const Sentiment = () => {
  return (
    <Container>
      <SideBar />
      <Contents />
    </Container>
  );
};

export default Sentiment;
