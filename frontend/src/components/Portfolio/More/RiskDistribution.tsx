import styled from "styled-components";
import {
  AreaChart,
  Area,
  ReferenceLine,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import axios from "axios";
import { useEffect, useState } from "react";

const GraphContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  width: 100%;
  height: 100%;
`;

interface DataProp {
  index: number;
  x: number;
  y: number;
}

const RiskDistribution = () => {
  const [data, setData] = useState<DataProp[]>([]);
  const searchAPI = () => {
    axios
      .get("http://0.0.0.0:8001/risk-distribution")
      .then((res) => {
        setData(JSON.parse(res.data)[0].distribution);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    searchAPI();
  }, []);

  return (
    <GraphContainer>
      <ResponsiveContainer width="80%" height="80%">
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="x" />
          <YAxis />
          <ReferenceLine x={-0.1} stroke="red" label="-0.1" />
          <ReferenceLine
            x={-0.05}
            stroke="red"
            label="-0.05"
            alwaysShow={true}
          />
          <Area type="monotone" dataKey="y" stroke="#8884d8" fill="#8884d8" />
        </AreaChart>
      </ResponsiveContainer>
    </GraphContainer>
  );
};

export default RiskDistribution;
