// simple line graph : Portfolio Value over time
import styled from "styled-components";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";

const TopGraphContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

interface SingleProp {
  index: number;
  time: string;
  value: number;
}

interface GraphProp {
  refresh: boolean;
}

const TopGraph = ({ refresh }: GraphProp) => {
  const [portfolioValue, setPortfolioValue] = useState<SingleProp[]>([
    { index: 0, time: "", value: 0 },
  ]);

  const searchAPI = () => {
    axios
      .get("http://0.0.0.0:8001/portfolio-value-over-time")
      .then((res) => {
        setPortfolioValue(JSON.parse(res.data));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    searchAPI();
  }, [refresh]);

  return (
    <TopGraphContainer>
      <ResponsiveContainer width="80%" height="80%">
        <LineChart
          width={500}
          height={300}
          data={portfolioValue}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" angle={360 - 45} />
          <YAxis dataKey="value" domain={["dataMin", "dataMax"]} />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#8884d8"
            activeDot={{ r: 8 }}
          />
          <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
        </LineChart>
      </ResponsiveContainer>
    </TopGraphContainer>
  );
};

export default TopGraph;
