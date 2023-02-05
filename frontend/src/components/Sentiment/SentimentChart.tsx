import styled from "styled-components";
import { ContainerComponentContainer } from "../ContentComponents";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Label,
} from "recharts";
import axios from "axios";
import { useEffect, useState } from "react";

const ChartContainer = styled(ContainerComponentContainer)`
  padding-left: 4%;
  padding-right: 4%;

  display: flex;
  flex-direction: column;
  align-items: center;
`;

const TitleContainer = styled.div`
  width: 100%;
  text-align: left;
  font-weight: 600;
  font-size: xx-large;
  padding-top: 3%;
  padding-left: 9%;
`;

interface dataProp {
  name: string;
  value: number;
}

const SentimentChart = () => {
  const colors = ["#758CBB", "#EA5E4D"];
  const [data, setData] = useState<dataProp[]>([]);
  const [ratio, setRatio] = useState<number>(0);

  const searchApi = () => {
    axios
      .get("/api/sentiment-pie")
      .then((response) => {
        console.log(JSON.parse(response.data));
        setData(JSON.parse(response.data));
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    searchApi();
  }, []);

  useEffect(() => {
    setRatio(
      data.length !== 0
        ? Math.round((data[0].value / (data[0].value + data[1].value)) * 100)
        : 0
    );
  }, [data]);

  return (
    <ChartContainer type="small" loc="right">
      <TitleContainer>Sentiments</TitleContainer>
      <ResponsiveContainer width="100%" height="80%">
        <PieChart>
          <Pie
            data={data}
            innerRadius={60}
            outerRadius={80}
            fill="#8884d8"
            paddingAngle={5}
            dataKey="value">
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index]} />
            ))}
            <Label value={`${ratio}%`} position="center" />
          </Pie>
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};
export default SentimentChart;
