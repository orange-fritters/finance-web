import styled from "styled-components";
import { TitleContainer } from "../ContentComponents";
import TopGraph from "./Plots/TopGraph";
import BottomGraph from "./Plots/BottomGraph";

const Container = styled.div`
  display: grid;
  grid-template-rows: minmax(0, 0.5fr) minmax(0, 3fr) minmax(0, 4fr);
  grid-template-columns: minmax(0, 1fr);
  // align-items: center;

  background-color: white;
  border: none;
  border-radius: 10px;

  margin-top: 4.65%;
  margin-bottom: 2.5%;
  margin-right: 5%;
`;

const TitleContainerGraph = styled(TitleContainer)`
  text-align: center;
`;

interface GraphProp {
  refresh: boolean;
}
const Graphs = ({ refresh }: GraphProp) => {
  return (
    <Container>
      <TitleContainerGraph>Portfolio Value Over Time</TitleContainerGraph>
      <TopGraph refresh={refresh} />
      <BottomGraph refresh={refresh} />
    </Container>
  );
};

export default Graphs;
