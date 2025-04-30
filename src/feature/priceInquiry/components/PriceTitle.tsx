import styled from "styled-components";
import { priceDataType } from "../types/priceTypes";
import { formatNumberWithComma } from "../utils/numberToPrice";

const PriceTitleWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding-bottom: 2%;
  margin-bottom: 2%;
  border-bottom: 1px solid black;
`;

const CoinNameWrapper = styled.div`
  width: fit-content;
`;

const CoinName = styled.div`
  font-size: 1.4rem;
  font-weight: bold;
`;

const CoinTag = styled.div`
  font-size: 0.9rem;
  color: rgb(156, 156, 156);
  font-weight: 550;
`;

const PriceWrapper = styled.div`
  width: fit-content;
`;

const CurrentPrice = styled.div`
  text-align: right;
  font-size: 1.4rem;
  font-weight: bold;
`;

const RiseRate = styled.div<{ $isPositive: boolean }>`
  text-align: right;
  color: ${(props) => (props.$isPositive ? '#22C55E' : 'red')};
`;

interface PriceTitleProps {
  priceData: priceDataType[];
}

const PriceTitle = ({ priceData }: PriceTitleProps) => {
  const latestClose = priceData[priceData.length - 1]?.close;
  const prevClose = priceData[priceData.length - 2]?.close;
  const riseRate = (( latestClose / prevClose ) * 100 - 100).toFixed(2);
  const isPositive = parseFloat(riseRate) >= 0;

  return (
    <PriceTitleWrapper>
      <CoinNameWrapper>
        <CoinName>비트코인</CoinName>
        <CoinTag>BTC/KRW</CoinTag>
      </CoinNameWrapper>
      <PriceWrapper>
        <CurrentPrice>₩{formatNumberWithComma(latestClose)}</CurrentPrice>
        <RiseRate $isPositive={isPositive}>{riseRate}%</RiseRate>
      </PriceWrapper>
    </PriceTitleWrapper>
  );
};

export default PriceTitle;
