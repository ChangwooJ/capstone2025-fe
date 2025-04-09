import styled from "styled-components";
import PriceInquiry from "../feature/priceInquiry/PriceInquiry";

const ExchangeWrapper = styled.div`
  width: 100%;
  height: 100%;
  background-color: #f1f4f9;
  box-sizing: border-box;
  padding: 2%;
`;

const Exchange = () => {
  return (
    <ExchangeWrapper>
      <PriceInquiry />
    </ExchangeWrapper>
  )
}

export default Exchange;