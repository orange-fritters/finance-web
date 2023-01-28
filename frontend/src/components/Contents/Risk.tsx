import styled from "styled-components";
import { ContainerComponentContainer } from "./ContentComponents";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
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
  {
    subject: "BTC",
    A: 120,
    B: 110,
    fullMark: 150,
  },
  {
    subject: "ETH",
    A: 98,
    B: 130,
    fullMark: 150,
  },
  {
    subject: "NASDAQ",
    A: 86,
    B: 130,
    fullMark: 150,
  },
  {
    subject: "S&P500",
    A: 99,
    B: 100,
  },
];
// declare type Props  of rencderCustomizedLabel

const Risk = () => {
  return (
    <ChartContainer type="small" loc="right">
      <TitleContainer>Risk</TitleContainer>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid />
          <PolarAngleAxis dataKey="subject" />
          <PolarRadiusAxis />
          <Radar
            name="Mike"
            dataKey="A"
            stroke="#8884d8"
            fill="#8884d8"
            fillOpacity={0.6}
          />
        </RadarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};
export default Risk;
