import { useEffect, useState } from "react";
import styled from "styled-components";
import { priceDataType } from "../priceInquiry/types/priceTypes";

const TradingSectionContainer = styled.div`
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.1);
  margin-top: 1%;
  width: 70%;
  height: 30%;
  padding: 2%;
`;

const TradingSectionHeader = styled.div`
  display: flex;
  width: 30%;
  height: 10%;
`;

const TradingStyle = styled.div<{isActive: boolean}>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50%;
  height: fit-content;
  padding: 8px 16px;
  font-weight: ${({ isActive }) => (isActive ? "bold" : "normal")};
  color: ${({ isActive }) => (isActive ? "white" : "gray")};
  box-shadow: 0 0 6px ${({ isActive }) => (isActive ? "#6fe4d1" : "none")};
  border-top-right-radius: 10px;
  border-top-left-radius: 10px;
  background-color: ${({ isActive }) => (isActive ? "#6fe4d1" : "rgb(245, 245, 245)")};
  cursor: pointer;
`;

const TradingSectionBody = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: fit-content;
  padding: 3%;
  border-radius: 10px;
  border-top-left-radius: 0;
  border: 1px solid #6fe4d1;
`;

const InputContainer = styled.div`
  display: flex;
  width: 100%;
  height: fit-content;
  gap: 3%;
`;

const InputWrapper = styled.div`
  font-size: 0.9rem;
  color: gray;
  gap: 5px;
  display: flex;
  flex-direction: column;
  width: 30%;
`;

const TradingInputWrapper = styled.div`
  display: flex;
  justify-content: right;
  width: 100%;
`;

const ValueButton = styled.button`
  height: 100%;
  aspect-ratio: 1 / 1;
  font-size: 1.3rem;
  color: gray;
  cursor: pointer;
`;

const TradingInput = styled.input`
  text-align: right;
  width: 100%;
  height: fit-content;
  font-size: 0.9rem;
  padding: 3% 5%;
  border: 1px solid rgb(189, 189, 189);
`;

const TradingSectionFooter = styled.div`
  display: flex;
  justify-content: right;
  padding: 2% 4% 0 0;
  width: 100%;
  height: fit-content;
`;

const Trading = styled.button`
  background-color: #6fe4d1;
  padding: 7px 10%;
  border-radius: 5px;
  border: none;
  color: white;
  font-size: 1.1rem;
  cursor: pointer;
`;

const TradingSection = () => {
  const [activeStyle, setActiveStyle] = useState("일반 매매");
  const [priceData, setPriceData] = useState<priceDataType[]>([]);
  const [price, setPrice] = useState(0);
  const [count, setCount] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("http://localhost:8000/api/price");
      const data = await res.json();
      setPriceData(data);

      if (data.length > 0) {
        setPrice(data[data.length - 1].close);
      }
    };

    fetchData();
  }, []);

  return (
    <TradingSectionContainer>
      <TradingSectionHeader>
        <TradingStyle
          isActive={activeStyle === "Ai 자동 매매"}
          onClick={() => setActiveStyle("Ai 자동 매매")}
        >
          Ai 자동 매매
        </TradingStyle>
        <TradingStyle
          isActive={activeStyle === "일반 매매"}
          onClick={() => setActiveStyle("일반 매매")}
        >
          일반 매매
        </TradingStyle>
      </TradingSectionHeader>
      <TradingSectionBody>
        <InputContainer>
          <InputWrapper>
            매수 가격 (USD)
            <TradingInputWrapper>
              <TradingInput value={price} type="number" min="0" />
              <ValueButton onClick={() => setPrice(price + 1)}>+</ValueButton>
              <ValueButton onClick={() => setPrice(price - 1)}>-</ValueButton>
            </TradingInputWrapper>
          </InputWrapper>
          <InputWrapper>
            주문 수량 (BTC)
            <TradingInput
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              type="number"
              min="0"
            />
          </InputWrapper>
          <InputWrapper>
            주문 총액 (USD)
            <TradingInput value={price * count} />
          </InputWrapper>
        </InputContainer>
        <TradingSectionFooter>
          <Trading>매수</Trading>
        </TradingSectionFooter>
      </TradingSectionBody>
    </TradingSectionContainer>
  );
};

export default TradingSection;