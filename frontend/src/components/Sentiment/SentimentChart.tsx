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

const data = [
  { name: "POSITIVE", value: 40 },
  { name: "NEGATIVE", value: 60 },
];

const SentimentChart = () => {
  const colors = ["#758CBB", "#EA5E4D"];
  const ratio = (data[0].value / (data[0].value + data[1].value)) * 100;

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
