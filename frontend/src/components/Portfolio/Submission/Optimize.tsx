import styled from "styled-components";
import { TitleContainer } from "../../ContentComponents";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import React, { useEffect } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";

const SliderContainer = styled.div`
  display: grid;
  grid-template-rows: 1fr 1fr 1fr 1fr;
  grid-template-columns: 1fr 1fr;

  justify-content: end;
  align-items: center;
  gap: 10%;

  padding-left: 7.5%;
  padding-right: 10%;
`;

const Container = styled.div`
  display: grid;
  grid-template-rows: 1fr;
  grid-template-columns: 1fr;
  height: 100%;
  align-items: center;
`;

const OptimizeContainer = styled.div`
  display: grid;
  grid-template-rows: minmax(0, 1fr) minmax(0, 1.5fr) minmax(0, 3fr) minmax(
      0,
      1fr
    );
  grid-template-columns: minmax(0, 1fr);
  height: 95%;
  border-radius: 5px;
  background-color: white;
  border: none;
  border-radius: 10px;
`;

const SingleSliderContainer = styled.div`
  display: grid;
  grid-template-rows: 1fr;
  grid-template-columns: minmax(0, 1fr) minmax(0, 2fr);

  justify-content: center;
  align-items: center;
  width: 100%;
  gap: 10%;
  padding-bottom: 10px;
`;

const AutoOptimzeButton = styled.button`
  display: grid;
  grid-template-rows: 1fr;
  grid-template-columns: 1fr;
  justify-content: center;
  justify-self: center;
  align-items: center;
  align-self: top;
  width: 60%;
  height: 70%;
  border-radius: 12px;
  background-color: #9bc474;
  border: none;
  font-size: 1.7rem;
  font-weight: 600;
  color: white;
`;

const TitleContainer2 = styled(TitleContainer)`
  text-align: center;
  padding: 0;
  padding-top: 10px;
`;

interface TickersProps {
  tickers: string[];
}

interface TickerValues {
  [key: number]: number;
}

interface dataValues {
  name: string;
  value: number;
}

const ManualOptimize = ({ tickers }: TickersProps) => {
  const [sliderValues, setSliderValues] = React.useState<TickerValues>({});
  const [pieData, setPieData] = React.useState<dataValues[]>([]);
  const colors = [
    "#8884d8",
    "#82ca9d",
    "#ffc658",
    "#ff0000",
    "#0000ff",
    "#00ff00",
    "#ff00ff",
    "#000000",
  ];
  useEffect(() => {
    let sum = 0;
    for (const key in sliderValues) {
      sum += sliderValues[key];
    }

    const data = [];
    for (const key in sliderValues) {
      data.push({
        name: key,
        value: Math.round((sliderValues[key] / sum) * 100),
      });
    }
    console.log(data);
    setPieData(data);
  }, [sliderValues]);

  return (
    <OptimizeContainer>
      <TitleContainer2>Optimization</TitleContainer2>
      <SliderContainer>
        {tickers.map((ticker) => (
          <SingleSliderContainer>
            {ticker}
            <Slider
              key={ticker}
              onChange={(value) =>
                setSliderValues({ ...sliderValues, [ticker]: value })
              }
              step={10}
            />
          </SingleSliderContainer>
        ))}
      </SliderContainer>
      <ResponsiveContainer width="88%" height="100%">
        <PieChart>
          <Pie
            data={pieData}
            dataKey="value"
            nameKey="name"
            startAngle={180}
            endAngle={0}
            innerRadius="80%"
            outerRadius="100%"
            paddingAngle={5}
            label={true}
            cx="50%"
            cy="75%">
            {pieData.map((data, index) => (
              <Cell key={`cell-${index}`} fill={colors[index]} />
            ))}
          </Pie>
          <Legend layout="vertical" align="right" verticalAlign="middle" />
        </PieChart>
      </ResponsiveContainer>
      <AutoOptimzeButton>Auto Optimize</AutoOptimzeButton>
    </OptimizeContainer>
  );
};

const Optimize = ({ tickers }: TickersProps) => {
  return (
    <Container>
      <ManualOptimize tickers={tickers} />
    </Container>
  );
};

export default Optimize;
