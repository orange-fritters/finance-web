import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { TitleContainer } from "../../ContentComponents";

const Label = styled.label`
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;

  font-size: 1.5rem;
  font-weight: 600;
  cursor: pointer;
`;

const Switch = styled.div`
  position: relative;
  width: 60px;
  height: 28px;
  background: #b3b3b3;
  border-radius: 32px;
  padding: 4px;
  transition: 300ms all;

  &:before {
    transition: 300ms all;
    content: "";
    position: absolute;
    width: 28px;
    height: 28px;
    border-radius: 35px;
    top: 50%;
    left: 4px;
    background: white;
    transform: translate(0, -50%);
  }
`;

const Input = styled.input`
  opacity: 0;
  position: absolute;

  &:checked + ${Switch} {
    background: #9bc474;

    &:before {
      transform: translate(32px, -50%);
    }
  }
`;

const Container = styled.div`
  display: grid;
  grid-template-rows: repeat(5, minmax(0, 1fr));
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);

  font-family: "Noto Sans KR", sans-serif;
  gap: 10px;
  background-color: #ffffff;
  border: none;
  border-radius: 10px;

  padding: 0.5rem;
  padding-left: 25%;
  padding-right: 25%;
`;

const TitleContainerChild = styled(TitleContainer)<{ loc: "left" | "right" }>`
  text-align: ${({ loc }) => (loc === "left" ? "right" : "left")};
  font-weight: 700;
`;

interface stateProps {
  onStateChange: (newValue: string[]) => void;
}

const CheckBox = ({ onStateChange }: stateProps) => {
  const tickers = [
    "AAPL",
    "AMZN",
    "GOOG",
    "META",
    "MSFT",
    "NFLX",
    "TSLA",
    "BTC",
  ];

  const [selectedTickers, setSelectedTickers] = useState<string[]>([]);
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.click();
    }
  }, []);

  const handleCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    if (checked) {
      setSelectedTickers([...selectedTickers, value]);
    } else {
      setSelectedTickers(selectedTickers.filter((ticker) => ticker !== value));
    }
  };

  useEffect(() => {
    onStateChange(selectedTickers);
  }, [onStateChange, selectedTickers]);

  return (
    <Container>
      <TitleContainerChild loc="left">Select</TitleContainerChild>
      <TitleContainerChild loc="right">Ticker</TitleContainerChild>
      <Label>
        <span>AAPL</span>
        <Input
          value={"AAPL"}
          type="checkbox"
          onChange={handleCheckbox}
          ref={ref}
        />
        <Switch />
      </Label>
      {tickers.slice(1).map((ticker) => (
        <Label>
          <span>{ticker}</span>
          <Input
            key={ticker}
            value={ticker}
            type="checkbox"
            onChange={handleCheckbox}
          />
          <Switch />
        </Label>
      ))}
    </Container>
  );
};

export default CheckBox;
