// 1. Efficient Frontier : Scatter Plot
// 2. Daily Return graph : Simple Line Graph
// 3. Return Histogram : Histogram
import React, { useEffect, useState } from "react";
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
  Bar,
  ZAxis,
  ComposedChart,
} from "recharts";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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

  &:hover {
    background-color: #5c6bc0;
  }

  &:active {
    margin-top: 2px;
    margin-left: 2px;
  }
`;

interface Prop {
  refresh: boolean;
}

const ScatterPlot = ({ refresh }: Prop) => {
  const [data, setData] = useState([]);

  const searchAPI = () => {
    axios
      .get("http://0.0.0.0:8001/scatter-plot")
      .then((res) => {
        setData(JSON.parse(res.data));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    searchAPI();
  }, [refresh]);

  return (
    <GraphContainer>
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart>
          <CartesianGrid />
          <XAxis
            type="number"
            dataKey="std"
            name="variance"
            domain={["dataMin", "dataMax"]}
          />
          <YAxis
            type="number"
            dataKey="mean"
            name="return"
            domain={["dataMin", "dataMax"]}
          />
          <ZAxis type="number" dataKey="sharpe" name="sharpe" />
          <Tooltip cursor={{ strokeDasharray: "3 3" }} />
          <Legend />
          <Scatter
            name="Sharpe Return"
            data={data}
            fill="#8884d8"
            shape="circle"
          />
        </ScatterChart>
      </ResponsiveContainer>
    </GraphContainer>
  );
};

const DailyReturn = ({ refresh }: Prop) => {
  const [data, setData] = useState([]);

  const searchAPI = () => {
    axios
      .get("http://0.0.0.0:8001/daily-return")
      .then((res) => {
        setData(JSON.parse(res.data)[0]);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    searchAPI();
  }, [refresh]);

  return (
    <GraphContainer>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" angle={360 - 45} />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="return"
            stroke="#8884d8"
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </GraphContainer>
  );
};

const ReturnHist = ({ refresh }: Prop) => {
  const [data, setData] = useState([]);

  const searchAPI = () => {
    axios
      .get("http://0.0.0.0:8001/return-hist")
      .then((res) => {
        console.log(JSON.parse(res.data)[0]);
        setData(JSON.parse(res.data)[0]);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    searchAPI();
  }, [refresh]);

  return (
    <GraphContainer>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
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
          <XAxis dataKey="start" name="Return" />
          <YAxis />
          <Bar dataKey="frequency" name="Frequency" fill="#8884d8" />
          <Tooltip />
        </ComposedChart>
      </ResponsiveContainer>
    </GraphContainer>
  );
};

interface GraphProp {
  refresh: boolean;
}

const BottomGraph = ({ refresh }: GraphProp) => {
  const [selectedComponent, setSelectedComponent] = useState("first");
  const nav = useNavigate();

  return (
    <Container>
      <GraphTitle>
        {selectedComponent === "first" && "Scatter Plot"}
        {selectedComponent === "second" && "Daily Return"}
        {selectedComponent === "third" && "Return Histogram"}
      </GraphTitle>
      {selectedComponent === "first" && <ScatterPlot refresh={refresh} />}
      {selectedComponent === "second" && <DailyReturn refresh={refresh} />}
      {selectedComponent === "third" && <ReturnHist refresh={refresh} />}
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
