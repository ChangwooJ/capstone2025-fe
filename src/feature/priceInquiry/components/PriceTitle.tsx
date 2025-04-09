import styled from "styled-components";

const PriceTitleWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
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

const RiseRate = styled.div<RiseRateProps>`
  text-align: right;
  color: ${(props) => (props.isPositive ? '#22C55E' : 'red')};
`;

interface RiseRateProps {
  isPositive: boolean;
}

interface priceDataType {
  id: number;
  datetime: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface PriceTitleProps {
  priceData: priceDataType[];
}

const PriceTitle = ({ priceData }: PriceTitleProps) => {
  const latestClose = priceData[priceData.length - 1]?.close;
  const yesterDayClose = priceData[priceData.length - 5]?.close;
  const riseRate = (( latestClose / yesterDayClose ) * 100 - 100).toFixed(2);
  const isPositive = parseFloat(riseRate) >= 0;

  return (
    <PriceTitleWrapper>
      <CoinNameWrapper>
        <CoinName>비트코인</CoinName>
        <CoinTag>BTC/USD</CoinTag>
      </CoinNameWrapper>
      <PriceWrapper>
        <CurrentPrice>${latestClose}</CurrentPrice>
        <RiseRate isPositive={isPositive}>{riseRate}%</RiseRate>
      </PriceWrapper>
    </PriceTitleWrapper>
  );
};

export default PriceTitle;
