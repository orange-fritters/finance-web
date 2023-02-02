import React from "react";
import styled from "styled-components";

const Container = styled.div`
  padding: 5%;

  display: grid;
  grid-template-rows: minmax(0, 0.8fr) 1fr 1fr 1fr;
  grid-template-columns: minmax(0, 1fr);

  flex-direction: column;
  align-items: center;

  background-color: white;
  border-radius: 10px;
`;

const TitleContainer = styled.div`
  width: 100%;
  text-align: left;
  font-weight: 600;
  font-size: 1.2rem;
  padding: 3%;
`;

const DataContainer = styled.div<{ border?: boolean }>`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  ${(props) =>
    props.border &&
    `border-top: 1px solid black;
  border-bottom: 1px solid black;`};
`;

const Metrics = () => {
  const data = [
    {
      name: "Page A",
      uv: 4000,
      pv: 2400,
      amt: 2400,
    },
    {
      name: "Page B",
      uv: 3000,
      pv: 1398,
      amt: 2210,
    },
    {
      name: "Page C",
      uv: 2000,

      pv: 9800,
      amt: 2290,
    },
  ];

  return (
    <Container>
      <TitleContainer>Metrics</TitleContainer>
      <DataContainer>{data[0].uv}</DataContainer>
      <DataContainer border={true}>{data[1].uv}</DataContainer>
      <DataContainer>{data[2].uv}</DataContainer>
    </Container>
  );
};

export default Metrics;
