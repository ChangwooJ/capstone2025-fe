import styled from "styled-components";
import PriceInquiry from "../feature/priceInquiry/PriceInquiry";
import TradingSection from "../feature/automaticTrading/TradingSection";
import MyWallet from "../feature/myWallet/MyWallet";
import AiTrade from "../feature/aiTrade/AiTrade";

const ExchangeWrapper = styled.div`
  display: flex;
  width: 100%;
  min-height: calc(100vh - 80px);
  background-color: #f8f9fa;
  box-sizing: border-box;
  padding: 2rem;
  gap: 2rem;
`;

const ExchangeInfo = styled.div`
  display: flex;
  flex-direction: column;
  width: 70%;
  gap: 2rem;
  height: fit-content;
`;

const MyInfo = styled.div`
  width: 30%;
  height: fit-content;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const Exchange = () => {
  return (
    <ExchangeWrapper>
      <ExchangeInfo>
        <PriceInquiry />
        <TradingSection />
      </ExchangeInfo>
      <MyInfo>
        <MyWallet />
        <AiTrade />
      </MyInfo>
    </ExchangeWrapper>
  );
}

export default Exchange;