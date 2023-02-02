import React, { MutableRefObject, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { ContainerComponentContainer } from "../ContentComponents";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import axios from "axios";

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

const Prediction = () => {
  const ref = useRef() as MutableRefObject<HTMLDivElement>;

  const [data, setData] = useState([]); // [data, setData
  const [height, setHeight] = useState(0);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    setHeight(ref.current.offsetHeight * 0.6);
    setWidth(ref.current.offsetWidth * 0.93);
    console.log(ref.current.offsetHeight, ref.current.offsetWidth);
  }, [height, width]);

  const searchApi = (ip?: string) => {
    axios.get("/api/home-predict").then((response) => {
      const pattern = /{(.*?)}/g;
      setData(
        response.data
          .slice(1, -1)
          .match(pattern)
          .map((item: string) => JSON.parse(item))
      );
    });
  };

  useEffect(() => {
    searchApi();
  }, []);

  useEffect(() => {
    console.log(data);
  }, [data]);

  return (
    <ChartContainer type="big" loc="none" ref={ref}>
      <TitleContainer>Crypto Prediction</TitleContainer>
      <LineChart width={width} height={height} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="ETH"
          stroke="#8884d8"
          activeDot={{ r: 8 }}
        />
        <Line type="monotone" dataKey="BTC" stroke="#82ca9d" />
      </LineChart>
    </ChartContainer>
  );
};

export default Prediction;
