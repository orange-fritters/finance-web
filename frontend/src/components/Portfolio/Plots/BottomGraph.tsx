// 1. Efficient Frontier : Scatter Plot
// 2. Daily Return graph : Simple Line Graph
// 3. Return Histogram : Histogram
import React, { useState } from "react";
import styled from "styled-components";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
  BarChart,
  Bar,
} from "recharts";
import { useNavigate } from "react-router-dom";

const Container = styled.div`
  display: grid;
  grid-template-rows:
    minmax(0, 0.5fr) minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr)
    minmax(0, 0.8fr);
  grid-template-columns: minmax(0, 1fr) minmax(0, 0.5fr);
  align-items: center;
  justify-items: stretch;
`;

const GraphContainer = styled.div`
  grid-column: 1 / 2;
  grid-row: 2 / 5;

  justify-self: center;
  align-self: center;

  width: 80%;
  height: 90%;
`;

const GraphTitle = styled.div`
  grid-column: 1 / 3;
  grid-row: 1 / 2;

  width: 100%;
  text-align: center;
  font-weight: 600;
  font-size: xx-large;
  padding: 3%;
`;

const GraphButton = styled.button<{ loc: "top" | "center" | "bottom" }>`
  width: 70%;
  height: 40%;
  background-color: #3f51b5;
  border: none;
  border-radius: 10px;
  font-size: 1.3rem;
  font-weight: 600;
  color: white;
  ${(props) => {
    if (props.loc === "top") {
      return "align-self: end";
    } else if (props.loc === "center") {
      return "align-self: center";
    } else {
      return "align-self: start";
    }
  }}
`;

const MoreButton = styled.button`
  grid-column: 1 / 3;
  width: 80%;
  height: 60%;
  background-color: #3f51b5;
  border: none;
  border-radius: 10px;
  font-size: 1.5rem;
  font-weight: 600;
  color: white;
  align-self: center;
  justify-self: center;
  margin-bottom: 3%;
  }}
`;

const ScatterPlot = () => {
  const data = [
    { x: 100, y: 200, z: 200 },
    { x: 120, y: 100, z: 260 },
    { x: 170, y: 300, z: 400 },
    { x: 140, y: 250, z: 280 },
    { x: 150, y: 400, z: 500 },
    { x: 110, y: 280, z: 200 },
  ];

  return (
    <GraphContainer>
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart>
          <CartesianGrid />
          <XAxis type="number" dataKey="x" name="stature" unit="cm" />
          <YAxis type="number" dataKey="y" name="weight" unit="kg" />
          <Tooltip cursor={{ strokeDasharray: "3 3" }} />
          <Scatter name="A school" data={data} fill="#8884d8" />
        </ScatterChart>
      </ResponsiveContainer>
    </GraphContainer>
  );
};

const DailyReturn = () => {
  const data = [
    {
      name: "Page A",
      uv: 4000,
      pv: 2400,
      amt: 2400,
    },
    {
      name: "Page B",
      uv: 3000,
      pv: 1398,
      amt: 2210,
    },
    {
      name: "Page C",
      uv: 2000,
      pv: 9800,
      amt: 2290,
    },
    {
      name: "Page D",
      uv: 2780,
      pv: 3908,
      amt: 2000,
    },
    {
      name: "Page E",
      uv: 1890,
      pv: 4800,
      amt: 2181,
    },
    {
      name: "Page F",
      uv: 2390,
      pv: 3800,
      amt: 2500,
    },
    {
      name: "Page G",
      uv: 3490,
      pv: 4300,
      amt: 2100,
    },
  ];

  return (
    <GraphContainer>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="pv"
            stroke="#8884d8"
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </GraphContainer>
  );
};

const ReturnHist = () => {
  const data = [
    {
      name: "Page A",
      uv: 4000,
      pv: 2400,
      amt: 2400,
    },
    {
      name: "Page B",
      uv: 3000,
      pv: 1398,
      amt: 2210,
    },
    {
      name: "Page C",
      uv: 2000,
      pv: 9800,
      amt: 2290,
    },
    {
      name: "Page D",
      uv: 2780,
      pv: 3908,
      amt: 2000,
    },
    {
      name: "Page E",
      uv: 1890,
      pv: 4800,
      amt: 2181,
    },
    {
      name: "Page F",
      uv: 2390,
      pv: 3800,
      amt: 2500,
    },
    {
      name: "Page G",
      uv: 3490,
      pv: 4300,
      amt: 2100,
    },
  ];

  return (
    <GraphContainer>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="pv" fill="#8884d8" />
          <Bar dataKey="uv" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
    </GraphContainer>
  );
};

const BottomGraph = () => {
  const [selectedComponent, setSelectedComponent] = useState("first");
  const nav = useNavigate();

  return (
    <Container>
      <GraphTitle>
        {selectedComponent === "first" && "Scatter Plot"}
        {selectedComponent === "second" && "Daily Return"}
        {selectedComponent === "third" && "Return Histogram"}
      </GraphTitle>
      {selectedComponent === "first" && <ScatterPlot />}
      {selectedComponent === "second" && <DailyReturn />}
      {selectedComponent === "third" && <ReturnHist />}
      <GraphButton loc="top" onClick={() => setSelectedComponent("first")}>
        Scatter Plot
      </GraphButton>
      <GraphButton loc="center" onClick={() => setSelectedComponent("second")}>
        Daily Return
      </GraphButton>
      <GraphButton loc="bottom" onClick={() => setSelectedComponent("third")}>
        Return Hist
      </GraphButton>
      <MoreButton onClick={() => nav("/portfolio-more")}>More</MoreButton>
    </Container>
  );
};

export default BottomGraph;
