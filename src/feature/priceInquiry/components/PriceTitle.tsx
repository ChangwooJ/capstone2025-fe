import styled from "styled-components";
import { priceDataType } from "../types/priceTypes";
import { formatNumberWithComma } from "../utils/numberToPrice";

const PriceTitleWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding-bottom: 1.5rem;
  margin-bottom: 1.5rem;
  border-bottom: 2px solid #e9ecef;
`;

const CoinNameWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const CoinName = styled.div`
  font-size: 1.8rem;
  font-weight: 700;
  color: #2c3e50;
  letter-spacing: -0.5px;
`;

const CoinTag = styled.div`
  font-size: 1rem;
  color: #6c757d;
  font-weight: 500;
  background-color: #f8f9fa;
  padding: 0.3rem 0.8rem;
  border-radius: 6px;
  display: inline-block;
`;

const PriceWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.5rem;
`;

const CurrentPrice = styled.div`
  font-size: 1.8rem;
  font-weight: 700;
  color: #2c3e50;
  letter-spacing: -0.5px;
`;

const RiseRate = styled.div<{ $isPositive: boolean }>`
  font-size: 1.1rem;
  font-weight: 600;
  color: ${(props) => (props.$isPositive ? '#22C55E' : '#ef4444')};
  background-color: ${(props) => (props.$isPositive ? '#f0fdf4' : '#fef2f2')};
  padding: 0.3rem 0.8rem;
  border-radius: 6px;
  display: inline-block;
`;

interface PriceTitleProps {
  priceData: priceDataType[];
}

const PriceTitle = ({ priceData }: PriceTitleProps) => {
  const latestClose = priceData[priceData.length - 1]?.close;
  const prevClose = priceData[priceData.length - 2]?.close;
  const riseRate = ((latestClose / prevClose) * 100 - 100).toFixed(2);
  const isPositive = parseFloat(riseRate) >= 0;

  return (
    <PriceTitleWrapper>
      <CoinNameWrapper>
        <CoinName>비트코인</CoinName>
        <CoinTag>BTC/KRW</CoinTag>
      </CoinNameWrapper>
      <PriceWrapper>
        <CurrentPrice>₩{formatNumberWithComma(latestClose)}</CurrentPrice>
        <RiseRate $isPositive={isPositive}>
          {isPositive ? '+' : ''}{riseRate}%
        </RiseRate>
      </PriceWrapper>
    </PriceTitleWrapper>
  );
};

export default PriceTitle;
