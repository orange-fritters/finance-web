import React from "react";
import styled from "styled-components";
import RiskDistribution from "./More/RiskDistribution";
import { useNavigate } from "react-router-dom";

const Container = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  background-color: #f5f5f5;
  padding-left: 2.5%;
  padding-right: 2.5%;
`;

const ContentsContainer = styled.div`
  display: grid;
  grid-template-rows: minmax(0, 0.5fr) minmax(0, 4fr) minmax(0, 1fr) minmax(
      0,
      0.5fr
    );
  grid-template-columns: minmax(0, 1fr);

  align-items: center;
  width: 100%;
  height: 95%;
  background-color: white;
`;

const MetricsContainer = styled.div`
  display: grid;
  grid-template-rows: minmax(0, 1fr) minmax(0, 1fr);
  grid-template-columns: minmax(0, 0.5fr) minmax(0, 1fr);

  border: none;
  border-radius: 10px;

  background-color: #f5f5f5;
  align-self: start;
  justify-self: center;
  width: 35%;
  height: 80%;

  // border internal center
  & > h1 {
    border-right: 1px solid black;
  }
`;

const ReturnButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  align-self: start;
  justify-self: center;
  width: 35%;
  height: 80%;
  border-radius: 10px;
  border: none;
  background-color: #3f51b5;
  color: white;
  font-size: 1.5rem;
  font-weight: bold;
  cursor: pointer;
`;

interface MetricsProps {
  UaR: number;
  ES: number;
}

const Metrics = ({ UaR, ES }: MetricsProps) => {
  return (
    <MetricsContainer>
      <h1>UaR</h1>
      <h2>{UaR}</h2>
      <h1>ES</h1>
      <h2>{ES}</h2>
    </MetricsContainer>
  );
};

const MoreContents = () => {
  const nav = useNavigate();
  return (
    <Container>
      <ContentsContainer>
        <h1>Risk Distribution</h1>
        <RiskDistribution />
        <Metrics UaR={100} ES={200} />
        <ReturnButton onClick={() => nav("/portfolio")}>Return</ReturnButton>
      </ContentsContainer>
    </Container>
  );
};

export default MoreContents;
