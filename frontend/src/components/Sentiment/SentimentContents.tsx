import React from "react";
import styled from "styled-components";
import Graph from "./Graph";
import SentimentChart from "./SentimentChart";
import Tweets from "./Tweets";

const ContentsContainer = styled.div`
  display: grid;
  // grid-template-rows: 1.5fr 1fr;
  // grid-template-columns: 1fr 1fr;

  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  grid-template-rows: minmax(0, 1.5fr) minmax(0, 1fr);

  width: 85%;
  height: 100vh;
  background-color: #f5f5f5;
`;

const Contents = () => {
  return (
    <ContentsContainer>
      <Graph />
      <Tweets />
      <SentimentChart />
    </ContentsContainer>
  );
};

export default Contents;
