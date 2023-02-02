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
    subject: "GOOD",
    value: 7.21,
  },
  {
    subject: "BAD",
    value: 6.47,
  },
];
// declare type Props  of rencderCustomizedLabel

const Tweets = () => {
  const colors = ["#758CBB", "#EA5E4D"];
  return (
    <ChartContainer type="small" loc="left">
      <TitleContainer>Tweets</TitleContainer>
      <ResponsiveContainer width="100%" height="80%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 50, bottom: 50, left: 5, right: 20 }}>
          <XAxis type="number" hide={true} />
          <YAxis
            dataKey="subject"
            type="category"
            axisLine={false}
            tickLine={false}
          />
          <Tooltip />
          <Label position="right" offset={0} />
          <Bar dataKey="value" radius={[10, 10, 10, 10]} barSize={30}>
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
