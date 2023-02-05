import styled from "styled-components";
import { ContainerComponentContainer } from "../ContentComponents";
import {
  ResponsiveContainer,
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
  Cell,
  Label,
  LabelList,
} from "recharts";
import { useEffect, useState } from "react";
import axios from "axios";

const ChartContainer = styled(ContainerComponentContainer)`
  padding-left: 4%;
  padding-right: 4%;

  display: flex;
  flex-direction: column;
  align-items: center;

  overflow: visible;
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
  subject: string;
  value: number;
}

const Tweets = () => {
  const colors = ["#758CBB", "#EA5E4D"];
  const [data, setData] = useState<dataProp[]>([]);

  const searchApi = () => {
    axios
      .get("/api/sentiment-bar")
      .then((response) => {
        setData(JSON.parse(response.data));
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    searchApi();
  }, []);

  return (
    <ChartContainer type="small" loc="left">
      <TitleContainer>Tweets</TitleContainer>
      <ResponsiveContainer width="80%" height="80%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 50, bottom: 50, left: 0, right: 20 }}>
          <XAxis type="number" hide={true} scale="sqrt" />
          <YAxis
            dataKey="subject"
            type="category"
            axisLine={false}
            tickLine={false}
          />
          <Tooltip />
          <Label position="right" offset={0} />
          <Bar dataKey="value" radius={[10, 10, 10, 10]} barSize={40}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index]} />
            ))}
            <LabelList dataKey="value" position="right" />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};
export default Tweets;
