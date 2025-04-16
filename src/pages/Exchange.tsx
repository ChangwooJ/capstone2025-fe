import styled from "styled-components";
import PriceInquiry from "../feature/priceInquiry/PriceInquiry";
import TradingSection from "../feature/automaticTrading/TradingSection";
import MyWallet from "../feature/myWallet/MyWallet";

const ExchangeWrapper = styled.div`
  display: flex;
  width: 100%;
  height: fit-content;
  background-color: var(--primary-background-color);
  box-sizing: border-box;
  padding: 2%;
  gap: 2%;
`;

const ExchangeInfo = styled.div`
  display: flex;
  flex-direction: column;
  width: 70%;
  height: fit-content;
`;

const MyInfo = styled.div`
  width: 28%;
  height: fit-content;
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
      </MyInfo>
    </ExchangeWrapper>
  );
}

export default Exchange;