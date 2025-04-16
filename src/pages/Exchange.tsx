import styled from "styled-components";
import PriceInquiry from "../feature/priceInquiry/PriceInquiry";
import TradingSection from "../feature/automaticTrading/TradingSection";

const ExchangeWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: fit-content;
  background-color: var(--primary-background-color);
  box-sizing: border-box;
  padding: 2%;
`;

const Exchange = () => {
  return (
    <ExchangeWrapper>
      <PriceInquiry />
      <TradingSection />
    </ExchangeWrapper>
  )
}

export default Exchange;