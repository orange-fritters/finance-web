import styled from "styled-components";
import { ContainerComponentContainer } from "./ContentComponents";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";

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
  { name: "Panic", value: 400 },
  { name: "Delighted", value: 300 },
];

const COLORS = ["#FF8042", "#FFBB28"];
const RADIAN = Math.PI / 180;

type Props = {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percent: number;
  index: number;
};

const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  index,
}: Props) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

// declare type Props  of rencderCustomizedLabel

const Sentiment = () => {
  return (
    <ChartContainer type="small" loc="left">
      <TitleContainer>Market Sentiment</TitleContainer>
      <ResponsiveContainer width="100%" height="80%">
        <PieChart width={400} height={400}>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value">
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};
export default Sentiment;
