import React from "react";
import styled from "styled-components";
import Graph from "./Graph";
import Metrics from "./Metrics";

const ContentsContainer = styled.div`
  display: grid;

  grid-template-rows: minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr);
  grid-template-columns: minmax(0, 1fr) minmax(0, 2.75fr) minmax(0, 0.15fr);

  width: 95%;
  height: 95vh;
  padding: 1.4%;
  gap: 2.5%;
  background-color: #f5f5f5;
`;

const TextContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  background-color: white;

  writing-mode: vertical-lr;
  font-size: x-large;
  font-weight: 600;
  color: black;

  border-radius: 10px;
  text-align: center;
  align-items: center;
  justify-content: center;
  vertical-align: middle;
`;

const Contents = () => {
  return (
    <ContentsContainer>
      <Metrics />
      <Graph />
      <TextContainer>Month Data Forecast</TextContainer>
      <Metrics />
      <Graph />
      <TextContainer>Week Data Forecast</TextContainer>
      <Metrics />
      <Graph />
      <TextContainer>Sentiment Included</TextContainer>
    </ContentsContainer>
  );
};

export default Contents;
