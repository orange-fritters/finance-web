import React from "react";
import styled from "styled-components";
import Prediction from "./Prediction";
import Risk from "./Risk";
import Sentiment from "./Sentiment";

const ContentsContainer = styled.div`
  display: grid;
  grid-template-rows: 1.5fr 1fr;
  grid-template-columns: 1fr 1fr;

  width: 85%;
  height: 100vh;
  background-color: #f5f5f5;
`;

const Contents = () => {
  return (
    <ContentsContainer>
      <Prediction />
      <Sentiment />
      <Risk />
    </ContentsContainer>
  );
};

export default Contents;
