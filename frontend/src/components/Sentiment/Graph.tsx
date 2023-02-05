// import React, { MutableRefObject, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { ContainerComponentContainer } from "../ContentComponents";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";

const ChartContainer = styled(ContainerComponentContainer)`
  padding-left: 4%;
  padding-right: 4%;

  // inside of the container inline style to middle horizontally
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const TitleContainer = styled.div`
  width: 100%;
  text-align: left;
  font-weight: 600;
  font-size: xx-large;
  padding: 3%;
`;

const GraphContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  width: 100%;
  height: 100%;
`;
interface dataProp {
  day: string;
  value: number;
}

const Graph = () => {
  const [data, setData] = useState<dataProp[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [interval, setInterval] = useState("Hour");

  const searchApi = () => {
    axios
      .get("/api/sentiment-historical/" + interval)
      .then((response) => {
        setData(JSON.parse(response.data));
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    searchApi();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ChartContainer type="big" loc="none">
      <TitleContainer>Tweets Histogram</TitleContainer>
      <GraphContainer>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            width={500}
            height={300}
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Bar type="monotone" dataKey="value" fill="#758CBB" />
          </BarChart>
        </ResponsiveContainer>
      </GraphContainer>
    </ChartContainer>
  );
};

export default Graph;
