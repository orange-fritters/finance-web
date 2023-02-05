import React from "react";
import styled from "styled-components";
import Graphs from "./Graphs";
import CheckBox from "./Submission/CheckBox";
import Optimize from "./Submission/Optimize";

const Container = styled.div`
  display: grid;
  grid-template-rows: minmax(0, 1fr) minmax(0, 2fr);
  grid-template-columns: minmax(0, 1fr);
  align-items: center;
  padding-left: 5%;
  padding-right: 5%;
`;

const ContentsContainer = styled.div`
  display: grid;
  grid-template-rows: 1fr;
  grid-template-columns: 1fr 1fr;

  width: 85%;
  height: 100vh;
  background-color: #f5f5f5;
`;

const Contents = () => {
  const [selectedTickers, setSelectedTickers] = React.useState<string[]>([]);
  const [refresh, setRefresh] = React.useState<boolean>(false);
  const handleTickers = (tickers: string[]) => {
    setSelectedTickers(tickers);
  };

  const handleRefresh = () => {
    setRefresh(!refresh);
  };

  // useEffect(() => {
  //   console.log(selectedTickers);
  // }, [selectedTickers]);

  return (
    <ContentsContainer>
      <Container>
        <CheckBox onStateChange={handleTickers} />
        <Optimize tickers={selectedTickers} handleRefresh={handleRefresh} />
      </Container>
      <Graphs refresh={refresh} />
    </ContentsContainer>
  );
};

export default Contents;
